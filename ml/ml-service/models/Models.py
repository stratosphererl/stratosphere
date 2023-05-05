import os
import joblib

import pandas as pd
import numpy as np

import logging

from sklearn.pipeline import Pipeline

class _CombinedModel:
    def __init__(self, model_gamemode: str):
        self.model_name = model_gamemode

        models_directory = os.path.join(os.getcwd(), 'models', model_gamemode)

        filename_game = f"{model_gamemode}_game_model.pkl"
        filename_player = f"{model_gamemode}_player_model.pkl"

        self.model_game: Pipeline = joblib.load(os.path.join(models_directory, filename_game))
        self.model_player: Pipeline = joblib.load(os.path.join(models_directory, filename_player))

    def predict_proba(self, X: pd.DataFrame):
        game_columns = [("game", "seconds_remaining"), ("game", "is_overtime"), ("game", "goal_differential")]

        goal_diff_is_zero = X[("game", "goal_differential")].round() == 0
        goal_diff_is_not_zero = X[("game", "goal_differential")].round() != 0

        classes = ["blue", "orange"]

        predicted_from_player = self.model_player.predict_proba(X.drop(columns=game_columns + [("target", "winner")]))

        predicted_from_game = self.model_game.predict_proba(X[game_columns])

        predicted_from_player = pd.DataFrame(predicted_from_player, columns=[classes[i] for i in self.model_player.classes_])[classes].to_numpy()
        predicted_from_game = pd.DataFrame(predicted_from_game, columns=[classes[i] for i in self.model_game.classes_])[classes].to_numpy()

        full_prediction = np.zeros((len(X), len(classes)))

        full_prediction[goal_diff_is_zero] = predicted_from_player[goal_diff_is_zero]
        full_prediction[goal_diff_is_not_zero] = predicted_from_game[goal_diff_is_not_zero]

        return full_prediction


duels_model = _CombinedModel('duels')
doubles_model = _CombinedModel('doubles')
standard_model = _CombinedModel('standard')