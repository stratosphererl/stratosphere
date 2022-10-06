import argparse
from io import FileIO
from msilib.schema import File
from rl_trained_models import ml_model

# Get argument parser
parser = argparse.ArgumentParser(description="Test your data against a number of our ML models!")

# Establish default parameters
parser.add_argument('ml_name', help='Name of the machine learning model to use', type=str,
    choices=['win_loss', 'key_moments', 'playstyle', 'formation'])
parser.add_argument('input', help='Input file', type=argparse.FileType('r', encoding='UTF-8'))
parser.add_argument('-o', '--output', help='Output file', type=argparse.FileType('w', encoding='UTF-8'))

args = parser.parse_args()
input: FileIO = args.input

ml_output = ml_model.get(args.ml_name)(input.read())

if args.output:
    output: FileIO = args.output
    output.write(str(ml_output))
else:
    print(str(ml_output))
