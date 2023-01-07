from flask import Flask, redirect, request, flash
from werkzeug.utils import secure_filename
import os
import json
import carball
from carball.json_parser.game import Game
from carball.analysis.analysis_manager import AnalysisManager

UPLOAD_FOLDER = 'uploads'
if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'replay'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)
    
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

## make a method called parser Read json file from uploads and return a json object
def parser_analyse(path):
        
    _json = carball.decompile_replay(path)
    game = Game()
    game.initialize(loaded_json=_json)

    analysis_manager = AnalysisManager(game)
    analysis_manager.create_analysis()

    return analysis_manager.get_json_data()

def parser(filename):
    with open(os.path.join("uploads", "replay.json")) as f:
        return json.load(f)
    

@app.route("/")
def home():
    return f"<img src={r'https://tinyurl.com/parserjumper'}/>"

@app.route('/parse/', methods=['GET', 'POST'])
def parse():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            print("file is allowed")
            filename = secure_filename(file.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            return parser(path)
    
    return parser(os.path.join(app.config['UPLOAD_FOLDER'], "replay.json"))

@app.route('/parse/analysis', methods=['POST', 'GET'])
def parse_analysis():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            print("file is allowed")
            filename = secure_filename(file.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            return parser_analyse(path)
    
    return parser_analyse(os.path.join(app.config['UPLOAD_FOLDER'], "replay_test.replay"))