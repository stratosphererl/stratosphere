from flask import Flask, abort
from rl_trained_models import ml_model

import json

app = Flask(__name__)

@app.route("/")
def home():
    return f"<img src={r'https://tinyurl.com/babymlmodel'}/>"

@app.route('/ml_models/')
def model_list():
    return json.dumps(list(ml_model.keys()))

@app.route('/ml_models/<model>/<input>')
def model_run(model, input):
    try:
        return json.dumps(ml_model[model](input))
    except:
        abort(400)