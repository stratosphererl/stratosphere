from carball import analyze_replay_file
from carball.analysis.analysis_manager import AnalysisManager
import logging

def parse(replay_path: str) -> AnalysisManager:
    return analyze_replay_file(replay_path, logging_level=logging.FATAL)

import os

import pandas as pd

from carball.generated.api.metadata.game_metadata_pb2 import Playlist
from carball.generated.api.metadata import game_metadata_pb2

from DataCleaning import formatFrames

replay_directory = os.path.join(os.getcwd(), "replays")

valid_playlists = [
    game_metadata_pb2.UNRANKED_DUELS,
    game_metadata_pb2.UNRANKED_DOUBLES,
    game_metadata_pb2.UNRANKED_STANDARD,
    game_metadata_pb2.CUSTOM_LOBBY,
    game_metadata_pb2.RANKED_DUELS,
    game_metadata_pb2.RANKED_DOUBLES,
    game_metadata_pb2.RANKED_SOLO_STANDARD,
    game_metadata_pb2.RANKED_STANDARD,
    game_metadata_pb2.TOURNAMENT,
]

player_columns_duels = ["blue_player_0", "orange_player_0"]
player_columns_doubles = ["blue_player_0", "blue_player_1", "orange_player_0", "orange_player_1"]
player_columns_standard = ["blue_player_0", "blue_player_1", "blue_player_2", "orange_player_0", "orange_player_1", "orange_player_2"]

player_columns = ["pos_x", "pos_y", "pos_z", "vel_x", "vel_y", "vel_z", "ang_vel_x", "ang_vel_y", "ang_vel_z", "rot_x", "rot_y", "rot_z", "boost", "has_left"]

player_columns_duels = [(player, column) for player in player_columns_duels for column in player_columns]
player_columns_doubles = [(player, column) for player in player_columns_doubles for column in player_columns]
player_columns_standard = [(player, column) for player in player_columns_standard for column in player_columns]

ball_columns = [("ball", sub_column) for sub_column in ["pos_x", "pos_y", "pos_z", "vel_x", "vel_y", "vel_z"]]
game_columns = [("game", sub_column) for sub_column in ["seconds_remaining", "is_overtime", "goal_differential"]]
targe_columns = [("target", "winner")]

duels_df = pd.DataFrame(columns=pd.MultiIndex.from_tuples(player_columns_duels + ball_columns + game_columns + targe_columns))
doubles_df = pd.DataFrame(columns=pd.MultiIndex.from_tuples(player_columns_doubles + ball_columns + game_columns + targe_columns))
standard_df = pd.DataFrame(columns=pd.MultiIndex.from_tuples(player_columns_standard + ball_columns + game_columns + targe_columns))

for replay in os.listdir(replay_directory):
    if replay.endswith(".replay"):
        try:
            am = parse(os.path.join(replay_directory, replay))

            if am.protobuf_game.game_metadata.playlist not in valid_playlists:
                raise Exception(f"Invalid playlist: {Playlist.Name(am.protobuf_game.game_metadata.playlist)}\nID: {am.protobuf_game.game_metadata.playlist}")
            
            if am.protobuf_game.mutators.game_mutator_index != 0 and am.protobuf_game.mutators.game_mutator_index != -1:
                raise Exception(f"Invalid mutator index: {am.protobuf_game.mutators.game_mutator_index}")
            
            try:
                frames = formatFrames(am)
            except Exception as e:
                raise Exception(f"Failed to format frames: {e}")
            
            sampled_frames = frames.sample(frac=.1)
            
            if len(frames.columns) == len(duels_df.columns):
                print(f"Parsed {replay} as duels")
                duels_df = pd.concat([duels_df, sampled_frames], ignore_index=True)
            elif len(frames.columns) == len(doubles_df.columns):
                print(f"Parsed {replay} as doubles")
                doubles_df = pd.concat([doubles_df, sampled_frames], ignore_index=True)
            elif len(frames.columns) == len(standard_df.columns):
                print(f"Parsed {replay} as standard")
                standard_df = pd.concat([standard_df, sampled_frames], ignore_index=True)
            else:
                raise Exception(f"Invalid number of columns: {len(frames.columns)}")
        except Exception as e:
            print(f"Failed to parse {replay}")
            print(e)


datasets_directory = os.path.join(os.getcwd(), "datasets")

duels_df.sample(frac=1).to_csv(os.path.join(datasets_directory, "duels.csv"), index=False)
doubles_df.sample(frac=1).to_csv(os.path.join(datasets_directory, "doubles.csv"), index=False)
standard_df.sample(frac=1).to_csv(os.path.join(datasets_directory, "standard.csv"), index=False)


