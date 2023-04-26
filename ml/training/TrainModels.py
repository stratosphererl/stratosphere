import os
import pandas as pd

datasets_directory = os.path.join(os.getcwd(), 'datasets')

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

from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline

from time import time

from typing import Union

for csv_file in os.listdir(datasets_directory):
    if not csv_file.endswith('.csv'):
        continue
    model_type = csv_file[:-4]
    
    df = pd.read_csv(os.path.join(datasets_directory, csv_file), header=[0, 1], low_memory=False)
    clean_df = clean(df)

    y = clean_df[("target", "winner")]

    def train_model(X: pd.DataFrame, y: pd.DataFrame, model_postfix: Union(str, None)=None) -> None:
        start = time()

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = Pipeline([
            ('pca2', PCA(n_components=.95)),
            ('svc', SVC(decision_function_shape='ovo', probability=True))
        ])

        sample_weight = (1 - X_train[("game", "seconds_remaining")]) * (X_train[("game", "goal_differential")] != 0) * .95 + .05
        model.fit(X_train, y_train, svc__sample_weight=sample_weight)

        y_pred_prob = model.predict_proba(X_test)
        y_pred = y_pred_prob.argmax(axis=1)
        y_pred = model.classes_[y_pred]

        confidences = (y_pred_prob.max(axis=1) - .5) * 2

        from sklearn.metrics import accuracy_score
        accuracy = accuracy_score(y_test, y_pred, sample_weight=confidences)

        if model_postfix is not None:
            model_name = f"{model_type}_{model_postfix}"

        print(f"{model_name} model trained in {time() - start} seconds")
        print(f"{model_name} model accuracy: {accuracy}")

        import joblib
        model_filename = f"{model_name}_model.pkl"
        joblib.dump(model, os.path.join(os.getcwd(), "models", model_filename))

    train_model(
        clean_df[[("game", "seconds_remaining"), ("game", "is_overtime"), ("game", "goal_differential")]],
        y, 
        "game"
    )
    
    train_model(
        clean_df.drop(columns=[("target", "winner"), ("game", "seconds_remaining"), ("game", "is_overtime"), ("game", "goal_differential")]), 
        y, 
        "player"
    )


