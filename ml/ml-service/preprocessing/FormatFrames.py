from carball.analysis.analysis_manager import AnalysisManager

import pandas as pd

def formatFrames(am: AnalysisManager) -> pd.DataFrame:
    df_copy = am.get_data_frame().copy()
    proto = am.get_protobuf_data()

    # Add Overtime column if it doesn't exist
    if ("game", "is_overtime") not in df_copy.columns:
        df_copy.insert(len(df_copy.columns), ("game", "is_overtime"), [None] * len(df_copy))

    # Add ping and ballcam to bots
    for player in proto.players:
        if player.is_bot:
            raise RuntimeError("Bots are not supported")
            # df_copy.insert(0, (player.name, "ping"), [0] * len(df_copy))
            # df_copy.insert(0, (player.name, "ball_cam"), [None] * len(df_copy))

    # Reorder columns so players are in order of score and team
    blue_players = sorted([player for player in proto.players if not player.is_orange], key=lambda player: player.score, reverse=True)
    orange_players = sorted([player for player in proto.players if player.is_orange], key=lambda player: player.score, reverse=True)

    blue_players = [player.name for player in blue_players]
    orange_players = [player.name for player in orange_players]

    if len(blue_players) == 0:
        raise ValueError("No blue players")
    if len(orange_players) == 0:
        raise ValueError("No orange players")

    team_size = max(len(blue_players), len(orange_players))

    if team_size > 3:
        raise ValueError("Too many players on a team")
    
    player_columns = df_copy[blue_players[0]].columns
    
    while len(blue_players) < team_size:
        new_player_name = "blue_player_" + str(len(blue_players))
        blue_players.append(new_player_name)
        for column in player_columns:
            df_copy.insert(len(df_copy.columns), (new_player_name, column), [None] * len(df_copy))

    while len(orange_players) < team_size:
        new_player_name = "orange_player_" + str(len(orange_players))
        orange_players.append(new_player_name)
        for column in player_columns:
            df_copy.insert(len(df_copy.columns), (new_player_name, column), [None] * len(df_copy))

    new_blue_players = [f"blue_player_{idx}" for idx, _ in enumerate(blue_players)]
    new_orange_players = [f"orange_player_{idx}" for idx, _ in enumerate(orange_players)]

    player_names = blue_players + orange_players
    new_player_names = new_blue_players + new_orange_players

    for old_player, new_player in zip(player_names, new_player_names):
        df_copy = df_copy.rename(columns={old_player: new_player})

    player_names, blue_players, orange_players = new_player_names, new_blue_players, new_orange_players

    # Helper function to drop multi-indexed columns
    from typing import Union, List
    def drop(df: pd.DataFrame, actors: Union[List[str], str], columns: Union[List[str], str]) -> pd.DataFrame:
        if isinstance(actors, str):
            actors = [actors]
        if isinstance(columns, str):
            columns = [columns]

        new_df = df.copy()
        for actor in actors:
            for column in columns:
                if (actor, column) in new_df.columns:
                    new_df = new_df.drop((actor, column), axis=1)
        return new_df

    # Drop unused columns
    unused_columns = {
        "player": ["ping", "throttle", "steer", "handbrake", "ball_cam", "dodge_active", "boost_active", "double_jump_active", "jump_active", "boost_collect"],
        "ball": ["hit_team_no", "ang_vel_x", "ang_vel_y", "ang_vel_z", "rot_x", "rot_y", "rot_z"],
        "game": ["time", "delta", "replicated_seconds_remaining", "ball_has_been_hit", "goal_number"]
    }
    df_copy = drop(df_copy, player_names, unused_columns["player"])
    df_copy = drop(df_copy, "ball", unused_columns["ball"])
    df_copy = drop(df_copy, "game", unused_columns["game"])

    # Add has_left column
    for player in player_names:
        left_index = len(df_copy) - 1
        while pd.isna(df_copy[(player, "pos_x")].iloc[left_index]) and left_index >= 0:
            left_index -= 1
        df_copy.insert(len(df_copy.columns), (player, "has_left"), [False] * (left_index + 1) + [True] * (len(df_copy) - left_index - 1))

    df_copy = df_copy[player_names + ["ball", "game"]]

   # Get goal frames in terms of teams rather than player ids
    player_id_to_team = {player.id.id: player.is_orange for player in proto.players}
    goals = [{"frame": goal.frame_number, "team": player_id_to_team[goal.player_id.id]} for goal in proto.game_metadata.goals]
    goals = sorted(goals, key=lambda goal: goal["frame"])

    # Find goal differential at each frame
    goal_differential_last = 0
    goal_differential = []
    last_frame = 0
    for goal in goals:
        frame = goal["frame"] - 1
        goal_differential += [goal_differential_last] * (frame - last_frame)
        goal_differential_last += -1 if goal["team"] else 1
        last_frame = frame
    goal_differential += [goal_differential_last] * (len(df_copy) - last_frame)

    # Insert goal differential to the dataframe (in favor of blue team)
    df_copy.insert(len(df_copy.columns), ("game", "goal_differential"), goal_differential)

    # Insert winner to the dataframe at each frame
    final_scores = proto.game_metadata.score
    winner = final_scores.team_0_score < final_scores.team_1_score
    df_copy.insert(len(df_copy.columns), ("target", "winner"), [winner] * len(df_copy))

    return df_copy
