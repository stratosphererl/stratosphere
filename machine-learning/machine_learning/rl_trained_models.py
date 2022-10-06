from email.policy import default
from random import random, seed


# Win Loss probability
def win_loss_model(someinput):
    seed(someinput)
    return random()


# List of key moments and their frames
def key_moments_model(someinput):
    seed(someinput)
    return [random()]


# Play styles of individual players
def playstyle_model(someinput):
    seed(someinput)
    return {"Player 1": random()}


# Formations of each team
def player_formation_model(someinput):
    seed(someinput)
    return {"Team 1": random()}


ml_model = {'win_loss': win_loss_model, 'key_moments': key_moments_model, 'playstyle': playstyle_model, 'formation': player_formation_model}
