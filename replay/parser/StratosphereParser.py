import os 
import re
import datetime as dt
import json
import copy

if os.getenv("PARSER"):
    from helper import date2season, debug2ranks, filename2map, decompiled_replay_has_keys, RLGameMode
else:
    from parser.helper import date2season, debug2ranks, filename2map, decompiled_replay_has_keys, RLGameMode

class StratosphereParser:
    """
    A helper class that manages replay parsing for you.

    If you wanted to go from .replay to analysis and frames, it looks like this:

    Replay binary -> decompiled replay json -> get game -> perform analysis -> export analysis and frames

    Keep in mind that no errors will be thrown, this class is intended to be performed for the parser, and
    any errors that happen will be stored in self.error.
    """

    VERSION = 1

    def __init__(self, raw_replay_fp : str):
        self.replay_fp = raw_replay_fp
        self.decompiled_replay = None
        self.player_actors = None
        # this is used to hold misattributed generated ids for cleaning the whole replay
        self.previous_ids = {}
        self.game = None
        self.am = None
        self.frames = None
    
    def get_decompile(self):
        """
        Returns a decompiled replay object
        """
        if not self.replay_fp.endswith(".replay"):
            raise Exception((f"{self.replay_fp} does not end with .replay. Please make sure it's a replay file and add the .replay extension."))
        
        if not os.path.exists(self.replay_fp):
            raise Exception("The file '{self.replay_fp}' could not be found.") 
        
        from boxcars_py import parse_replay

        self.decompiled_replay = parse_replay(open(self.replay_fp, 'rb').read())
        self.__init_player_actors()
    
    def get_game(self):
        """
        Returns a nicely formatted objected that holds game information. It does not perform any analysis.
        """        
        from carball.json_parser.game import Game

        if not self.decompiled_replay:
            self.get_decompile()


        game = Game()
        if not self.decompiled_replay:
            raise Exception(self.error if self.error else "Could not decompile replay. Is this replay format supported by boxcars?")
        game.initialize(loaded_json=self.decompiled_replay)
        self.game = game

    
    def init_analysis(self):
        """
        Performs and returns analysis of rocket league game.

        :param full: Determines whether a full intensive analysis should be performed, default to False
        """
        from carball.json_parser.game import Game
        from carball.analysis.analysis_manager import AnalysisManager

        if not isinstance(self.game, Game):
            raise(f"game is not a type {type(Game)}, but rather {type(self.game)}")
        
        return AnalysisManager(self.game)
        
    
    def perform_analysis(self, full=False):
        am = None
        if self.game:
            am = self.init_analysis()

        if self.game and am:
            am.create_analysis(calculate_intensive_events=full)
            self.am = am
            self.frames = self.am.get_data_frame()
        else:
            raise("Can not perform analysis. Replay is missing game data or has unsupported format.")
    
    def can_perform_analysis(self):
        """
        Returns a bool on whether an analysis can be performed.
        """
        df = self.am._initialize_data_frame(self.am.game)
        try:
            _,first_touch = self.am._get_kickoff_frames(self.am.game, self.am.protobuf_game, df)
            return self.am._can_do_full_analysis(first_touch)
        except:
            return False
        
    def amend_game(self, game):
        """
        Will try to amend the original game, rectifying issues with Carball parser, and adding additional information

        For example:
        - Adds correct online IDs for epic players [IMPLEMENTED]
        - Adds platform to players [IMPLEMENTED]
        - Adds proper gamemode [IMPLEMENTED]
        - Will add season information [IMPLEMENTED]
        - Expands on map information [IMPLEMENTED]
        - Will add ranking information, if ranked game and rankings are available [IMPLEMENTED]
        """
        game.gamemode = self.__get_gamemode()
        game.match_type = self.__get_match_type()
        game.game_type = self.__get_game_type()
        game.map = dict(self.__get_more_map(game))
        game.ranked = self.__get_ranked()
        game.season = dict(self.__get_season(game))
        game.region = self.__get_region(game)
        game.overtime = self.__get_overtime(game)

        # some cases there are no players, but they are hidden under teams
        if not game.players:
            for team in game.teams:
                game.players.extend(team.players)
    
        self.__correct_online_ids(game)
        self.__add_platform_ids(game)
        self.__get_mmr_for_players(game)


    def __init_player_actors(self):
        """
        Gets all actors with reservations (aka real human players not bots)
        """
        player_actors = {}

        if not self.decompiled_replay['network_frames']:
            raise Exception("Decompiled replay has no network frames. Unable to extract player actors.")

        network_frames = self.decompiled_replay['network_frames']['frames']

        for frame in network_frames:
            actors = frame['updated_actors']

            for actor in actors:
                actor = actor['attribute']
                is_player = 'Reservation' in actor

                if not is_player: continue 

                name = actor['Reservation']['name']
                platform = list(actor['Reservation']['unique_id']['remote_id'].keys())[0]
                online_id = actor['Reservation']['unique_id']['remote_id'][platform]

                if isinstance(online_id, dict): # weird edge case, where platform is nested dictionary, playstation
                    online_id = online_id['online_id']

                player = dict(name=name, platform=platform.lower(), online_id=online_id)

                if player['name'] not in player_actors:
                    player_actors[player['name']] = player
        
        self.player_actors = player_actors
    
    def __correct_online_ids(self, game):
        """
        Edits in place online ids for a game.
        """
        if not self.player_actors:
            return
            
        
        for player in game.players:
            match = re.match(r"^b\w+b$", player.online_id) and len(player.online_id) == 11

            if match and player.name in self.player_actors:
                self.previous_ids[player.online_id] = self.player_actors[player.name]['online_id']
                player.online_id = self.player_actors[player.name]['online_id']

    def __add_platform_ids(self, game):
        """
        Adds in place online ids for a game.
        """
        if not self.player_actors:
            return 
        
        for player in game.players:
            if player.name in self.player_actors:
                player.platform = self.player_actors[player.name]['platform']
            else:
                if player.is_bot:
                    player.platform = 'robot'
    
    def __get_gamemode(self):
        """
        Adds gamemode (hoops, snowday, etc) to game
        """
        return RLGameMode.get_gamemode(self.decompiled_replay)
    
    def __get_match_type(self):
        """
        Adds the type of match (e.g. offline, private, online)
        """
        match_type = ""
        MATCH_TYPES = ['Offline', 'Private', 'Online', 'LAN', 'Season', 'Tournament', 'FaceIt']

        for TYPE in MATCH_TYPES:
            replay_matchtype = self.decompiled_replay['properties']['MatchType']

            if replay_matchtype.lower() == TYPE.lower():
                match_type = TYPE
    
        return match_type
    
    def __get_ranked(self):
        """
        Returns 'Ranked' or 'Unranked'
        """
        RANKED_GAME_CLASS = "TAGame.MatchType_PublicRanked_TA"

        isRanked = False

        for class_idx in self.decompiled_replay['class_indices']:
            if class_idx['class'] == RANKED_GAME_CLASS:
                isRanked = True
                break

        return isRanked

    def __get_game_type(self):
        """
        returns how many players are on a team in the Rocket League terminology
        e.g. 1 player per team -> Duels)
        """
        OFFICAL_GAME_TYPES = {
        '1v1': 'Duels',
        '2v2': 'Doubles',
        '3v3': 'Standard',
        '4v4': 'Chaos'
        }

        team_size = self.decompiled_replay['properties']['TeamSize']
        game_type_key = f"{team_size}v{team_size}"

        if game_type_key in OFFICAL_GAME_TYPES:
            return OFFICAL_GAME_TYPES[game_type_key]
        else:
            return game_type_key # custom game_type accounts for 5v5+
    
    def __get_more_map(self, game):
        """
        Makes the map more detailed
        """
        return filename2map(game.map)

    def __get_season(self, game):
        """
        Gets season from date
        """
        return date2season(game.datetime)
    
    def __get_region(self, game):
        """
        Gets region from server name
        """
        prefix2region_map = {
            "use": "US-East",
            "eu": "Europe",
            "usw": "US-West",
            "asm": "Asia South-East (Maritime)",
            "asc": "Asia South-East (Mainland)",
            "me": "Middle East",
            "jpn": "Asia East",
            "oce": "Oceania",
            "saf": "South Africa",
            "sam": "South America",
            "ind": "India"
        }
        UNKNOWN = "Unspecified Region"
        server_name = game.game_info.server_name

        if not server_name or len(server_name) < 2: return UNKNOWN

        prefix_match = re.search(r"^[A-Za-z]+", server_name)

        if prefix_match and prefix_match.group(0).lower() in prefix2region_map:
            return prefix2region_map[prefix_match.group(0).lower()]
        
        return UNKNOWN

    def __get_overtime(self, game):
        try:
            overtime_frames = game.frames.loc[game.frames['is_overtime'] == True]
        except:
            return -1
        
        if len(overtime_frames) <= 0: return 0

        return round(len(overtime_frames)/game.properties['RecordFPS'], 2)
    
    def __get_mmr_for_players(self, game):
        if not self.game.ranked: return
        playlist = self.game.game_type if game.gamemode == 'Soccar' else game.gamemode
        player_ranks = debug2ranks(self.decompiled_replay['debug_info'], playlist=playlist)
        
        for player in game.players:
            if  player_ranks and player.online_id in player_ranks:
                rank_info = player_ranks[player.online_id]
                player.rank = {
                    'mmr': rank_info['mmr'],
                    'id': rank_info['rank']['id'] if rank_info['mmr'] else None,
                    'title': rank_info['rank']['name'] if rank_info['mmr'] else None,
                    'division': rank_info['rank']['division'] if rank_info['mmr'] else None
                }
            else:
                player.rank = None
    
    def __get__generated_replay_name(self, game):
        is_online = game.match_type == 'Online'
        match_type = "" if is_online else game.match_type
        game_sweatiness = 'Ranked' if game.ranked else 'Casual' if is_online else ""
        formatted_date = game.datetime.strftime("%Y-%m-%d.%H.%M")
        gamemode = game.game_type if game.gamemode == 'Soccar' else game.gamemode

        return f"{formatted_date} {game_sweatiness} {match_type} {gamemode} Game".replace("  ", " ")
    
            
    def get_gameHeader(self, game):
        header = {
            "id": game.id,
            "name": game.name if game.name else self.__get__generated_replay_name(game),
            "uploadDate": dt.datetime.now().timestamp(),
            "map": game.map,
            "length": round(len(game.frames)/game.properties['RecordFPS'], 2),
            "overtime": game.overtime,
            "region": game.region,
            "ranked": game.ranked,
            "time": game.datetime.timestamp(),
            "teamSize": game.team_size,
            "matchType": game.match_type,
            "gameMode": game.gamemode,
            "gameType": game.game_type,
            "season": game.season,
            "players": ParsingHelper.format_players(game.players),
            "teams": ParsingHelper.format_teams(game.teams),
            "frames": len(game.frames),
            "goals": ParsingHelper.convert_goals(game.goals),
            "demos": ParsingHelper.convert_demos(game.demos),
            "primaryPlayerId": game.primary_player,
            "version": game.replay_version,
        }

        return header
    
    def __get_meta_parse_info(self, analysisFail=False):
        return {
            "parseMeta": {
                "version": StratosphereParser.VERSION,
                "analysisFail": analysisFail
                }
            }
            
    def get_json_data(self):
        header = self.get_gameHeader(self.game)
        body = self.am.get_json_data() if self.am else {}

        if body:
            del body['gameMetadata']
        
        return ParsingHelper.replace_previous_ids(self.previous_ids, {"gameHeader": header, **body, **self.__get_meta_parse_info(analysisFail=not body)})
    
    def to_json_file(self, fp):
        from carball.analysis.utils.json_encoder import CarballJsonEncoder
        json.dump(self.get_json_data(), open(fp, "w"), cls=CarballJsonEncoder)

class ParsingHelper:
    @staticmethod
    def slice_frames(df, level1by=[], level2by=['pos_x', 'pos_y', 'vel_x', 'vel_y', 'boost', 'boost_active', 'delta', 'is_overtime']):
        """
        Returns a replay frames containing the specified columns and index levels.

        :param df: DataFrame to slice
        :param level1by: First level index to select, default to all
        :param level2by: Second level index to select, default to ['pos_x', 'pos_y', rot_y 'vel_x', 'vel_y', 'boost', 'boost_active', 'is_overtime']
        :return: Sliced DataFrame
        """
        level1by = level1by if len(level1by) != 0 else slice(None) 
        return df.loc[:, (level1by, level2by)]
    
    @staticmethod
    def export_frames_as_zipped_csv(df, fp):
        """
        Exports frames as supported by stratosphererl.com as a zipped csv

        :param df: DataFrame containing regular and extra data
        :param fp: File path to save the DataFrame to, ensure it just ends in csv.
        :return: Combined and sorted DataFrame
        """
        regular_data = ParsingHelper.slice_frames(df)
        extra_data = ParsingHelper.slice_frames(df, level1by=['ball'], level2by=['pos_z'])
        merged = regular_data.join(extra_data).sort_index(axis=1)

        filename = fp.split('/')[-1]

        merged.to_csv(f'{fp}.zip', compression=dict(method='zip', archive_name=f'{filename}.csv'))
    
    @staticmethod
    def __clean_team_name(k,v,o):
       default_name_by_color = lambda o: 'Orange' if o['is_orange'] else 'Blue'
       if k != "name": return v
       if k == "name" and v: return v
       return default_name_by_color(o)
    
    @staticmethod
    def replace_values(d, key, value_map):
        """
        Recursively replace values in dictionary d that match key with the
        corresponding value in value_map.
        """
        if isinstance(d, dict):
            new_dict = {}
            for k, v in d.items():
                if isinstance(v, dict) or isinstance(v, list):
                    new_dict[k] = ParsingHelper.replace_values(v, key, value_map)
                elif k == key and v in value_map:
                    new_dict[k] = value_map[v]
                else:
                    new_dict[k] = v
            return new_dict
        elif isinstance(d, list):
            return [ParsingHelper.replace_values(item, key, value_map) for item in d]
        else:
            return d
    
    @staticmethod
    def extract_only_properties(obj, attributes : list, clean_methods=[lambda k,v,o: v]):
        result = {}

        for method in clean_methods:
                for k,v in vars(obj).items():
                    if k in attributes:
                            result[k] = method(k, v, vars(obj))
        return result
    
    @staticmethod
    def format_teams(teams, only_keys=['is_orange', 'name', 'score']):
        return [ParsingHelper.extract_only_properties(team, only_keys, clean_methods=[ParsingHelper.__clean_team_name]) for team in teams]
    
    @staticmethod
    def format_players(players, only_keys=['name', 'online_id', 'is_orange', 'is_bot', 'rank', 'platform', 'score', 'assists', 'saves', 'shots']):
        return [ParsingHelper.extract_only_properties(player, only_keys) for player in players]
    
    @staticmethod
    def replace_previous_ids(previous_ids, replayJson):
        return ParsingHelper.replace_values(replayJson, "id", previous_ids)
    
    @staticmethod
    def convert_goals(goals):
        """
        This is a method that cleans weird issues with carball's handling of its repr for goals/players
        """
        converted = [vars(goal) for goal in goals]
        for goal in converted:
            if 'player' in goal:
                del goal['player']
        return converted
    
    @staticmethod
    def convert_demos(demos):
        """
        This is a method that cleans weird issues with carball's handling of its repr for players in demos
        """
        converted = copy.copy(demos)

        for demo in converted:
            demo['attacker'] = demo['attacker'].name
            demo['victim'] =demo['victim'].name
        
        return converted