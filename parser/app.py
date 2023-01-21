from flask import Flask, redirect, request, flash
from werkzeug.utils import secure_filename
import os
import json
import carball
from carball.json_parser.game import Game
from carball.analysis.analysis_manager import AnalysisManager
import psycopg
from util import getTeamInfo, convertToDict, convertToMinSec

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

@app.route('/parse/replayList', methods=['GET'])
def parse_replayList():
    conn = psycopg.connect(dbname="parserdb", user="postgres", password="test1", host="parserdb", port=5432) # the password part is INSECURE?

    cur = conn.cursor()
    cur.execute("SELECT * FROM replay;")
    data = cur.fetchall()

    returnData = []

    for index in range(len(data)):
        # if index == 10:
        #     break
        returnData.append(list(data[index]))

        # Converting duration in seconds into mm:ss format
        returnData[-1][6] = convertToMinSec(returnData[-1][6])

        # Converting overtime in seconds into mm:ss format
        returnData[-1][7] = convertToMinSec(returnData[-1][7]) 

        # Converting arena number into arena name
        cur.execute("SELECT name FROM arena WHERE num = %(int)s;", {'int': returnData[-1][8]})
        arena = cur.fetchone()
        returnData[-1][8] = arena[0]

        # Converting BLUE team id number into a list which includes clubname and player usernames
        returnData[-1][9] = getTeamInfo(returnData, 9, cur)

        # Converting ORANGE team id number into a list which includes clubname and player usernames
        returnData[-1][10] = getTeamInfo(returnData, 10, cur)

        # Converting season num into name
        cur.execute("SELECT name FROM season WHERE num = %(int)s;", {'int': returnData[-1][11]})
        season = cur.fetchone()
        returnData[-1][11] = season[0]

        # Converting avgRank num into name
        cur.execute("SELECT name FROM ranking WHERE num = %(int)s;", {'int': returnData[-1][13]})
        avgRank = cur.fetchone()
        returnData[-1][13] = avgRank[0]

        # Converting gamemode num into name
        cur.execute("SELECT name FROM gamemode WHERE num = %(int)s;", {'int': returnData[-1][14]})
        gamemode = cur.fetchone()
        returnData[-1][14] = gamemode[0]

        # Converting gametype num into name
        cur.execute("SELECT name FROM gametype WHERE num = %(int)s;", {'int': returnData[-1][15]})
        gametype = cur.fetchone()
        returnData[-1][15] = gametype[0]

    for index in range(len(returnData)):
        returnData[index] = convertToDict(returnData[index])
        
    return returnData