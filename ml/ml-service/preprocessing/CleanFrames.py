import pandas as pd

def clean(df: pd.DataFrame) -> pd.DataFrame:
    df_copy = df.copy()

    df_copy[("target", "winner")] = df_copy[("target", "winner")].astype(int)
    df_copy[("game", "is_overtime")] = df_copy[("game", "is_overtime")].fillna(0).astype(int)

    from typing import Union
    def scale(df: pd.DataFrame, min: Union[int, float], max: Union[int, float]) -> pd.DataFrame:
        df_copy = df.copy()
        return (df_copy - min) / (max - min)

    df_copy[("game", "goal_differential")] = scale(df_copy[("game", "goal_differential")], -5, 5)
    df_copy[("game", "seconds_remaining")] = scale(df_copy[("game", "seconds_remaining")].fillna(0), 0, 300)

    pos_x_cols = [column for column in df_copy.columns if column[1] == "pos_x"]
    df_copy[pos_x_cols] = df_copy[pos_x_cols].fillna(10000)
    df_copy[pos_x_cols] = scale(df_copy[pos_x_cols], -4098, 4098)

    pos_y_cols = [column for column in df_copy.columns if column[1] == "pos_y"]
    df_copy[pos_y_cols] = scale(df_copy[pos_y_cols], -6000, 6000)
    df_copy[pos_y_cols] = df_copy[pos_y_cols].fillna(10000)

    pos_z_cols = [column for column in df_copy.columns if column[1] == "pos_z"]
    df_copy[pos_z_cols] = scale(df_copy[pos_z_cols], 0, 2050)
    df_copy[pos_z_cols] = df_copy[pos_z_cols].fillna(10000)

    vel_cols = [column for column in df_copy.columns if column[1].startswith("vel")]
    df_copy[vel_cols] = df_copy[vel_cols].fillna(0)

    player_vel_cols = [column for column in vel_cols if column[0] != "ball"]
    ball_vel_cols = [column for column in vel_cols if column[0] == "ball"]

    df_copy[player_vel_cols] = scale(df_copy[player_vel_cols], -23000, 23000)
    df_copy[ball_vel_cols] = scale(df_copy[ball_vel_cols], -42000, 42000)

    boost_cols = [column for column in df_copy.columns if column[1] == "boost"]
    df_copy[boost_cols] = df_copy[boost_cols].fillna(0)
    df_copy[boost_cols] = scale(df_copy[boost_cols], 0, 255)

    has_left_cols = [column for column in df_copy.columns if column[1] == "has_left"]
    df_copy[has_left_cols] = df_copy[has_left_cols].astype(int)

    ang_vel_cols = [column for column in df_copy.columns if column[1].startswith("ang")]
    df_copy[ang_vel_cols] = scale(df_copy[ang_vel_cols].fillna(0), -5500, 5500)

    from math import pi
    rot_cols = [column for column in df_copy.columns if column[1].startswith("rot")]
    df_copy[rot_cols] = scale(df_copy[rot_cols].fillna(0), -pi, pi)

    return df_copy