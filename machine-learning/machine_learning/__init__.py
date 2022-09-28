from rl_trained_models import *
import sys

# Option of input via command line arguments
# Defaults to 10
input = 10
if len(sys.argv) > 1:
    input = sys.argv[1]

# Printing different outputs from our models
print(win_loss_model(input))
print(key_moments_model(input))
print(play_style_model(input))
print(player_formation_model(input))
