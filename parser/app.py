from flask import Flask, redirect, request, flash
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv 
import os
import json
import carball
from carball.json_parser.game import Game
from carball.analysis.analysis_manager import AnalysisManager
import psycopg
from util import getTeamInfo, convertToDict, convertToMinSec, breakDateTimeApart

UPLOAD_FOLDER = 'uploads'
if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'replay'}

load_dotenv()
parserPassword = os.environ.get('PARSERPASSWORD')

app = Flask(__name__)
CORS(app)
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
    conn = psycopg.connect(dbname="parserdb", user="postgres", password=parserPassword, host="parserdb", port=5432) # the password part is INSECURE?

    cur = conn.cursor()
    cur.execute("SELECT * FROM replay;")
    data = cur.fetchall()

    returnData = []

    for index in range(len(data)):
        returnData.append(list(data[index]))

        # Converting upload date into two parts: date and time
        returnData[-1][4] = breakDateTimeApart(returnData[-1][4])

        # Converting played date into two parts: date and time
        returnData[-1][5] = breakDateTimeApart(returnData[-1][5])

        # Converting duration in seconds into mm:ss format
        returnData[-1][6] = convertToMinSec(returnData[-1][6])

        # Converting overtime in seconds into mm:ss format
        returnData[-1][7] = convertToMinSec(returnData[-1][7]) 

        # Converting arena number into arena name
        cur.execute("SELECT name FROM arena WHERE num = %(int)s;", {'int': returnData[-1][8]})
        arena = cur.fetchone()
        returnData[-1][8] = arena[0]

        # Converting BLUE team id number into a dict which includes clubname, list of player usernames, and team score
        returnData[-1][9] = getTeamInfo(returnData, 9, cur)

        # Converting ORANGE team id number into a dict which includes clubname, list of player usernames, and team score
        returnData[-1][10] = getTeamInfo(returnData, 10, cur)

        # Converting season num into name
        cur.execute("SELECT name FROM season WHERE num = %(int)s;", {'int': returnData[-1][11]})
        season = cur.fetchone()
        returnData[-1][11] = season[0]

        # Converting avgRank num into name and storing that with the rank's original number
        rankInfo = {}
        rankInfo["num"] = returnData[-1][13]

        cur.execute("SELECT name FROM ranking WHERE num = %(int)s;", {'int': returnData[-1][13]})
        avgRank = cur.fetchone()
        rankInfo["name"] = avgRank[0]
        
        returnData[-1][13] = rankInfo

        # Converting gamemode num into name
        cur.execute("SELECT name FROM gamemode WHERE num = %(int)s;", {'int': returnData[-1][14]})
        gamemode = cur.fetchone()
        returnData[-1][14] = gamemode[0]

        # Converting gametype num into name
        cur.execute("SELECT name FROM gametype WHERE num = %(int)s;", {'int': returnData[-1][15]})
        gametype = cur.fetchone()
        returnData[-1][15] = gametype[0]

        # Appeding a boolean to denote whether this replay is the the last replay in the list
        returnData[-1].append(0) # Set each replay to false (thus show horizontal bar below per filtering.tsx)

    returnData[-1][16] = 1 # For the last replay however, set its "last" values to true, meaning no horizontal bar will be shown below it

    for index in range(len(returnData)):
        returnData[index] = convertToDict(returnData[index])
        
    return returnData

@app.route('/parse/all/<relation>')
def parse_relation(relation):
    conn = psycopg.connect(dbname="parserdb", user="postgres", password=parserPassword, host="parserdb", port=5432)
    
    cur = conn.cursor()
    cur.execute("SELECT * FROM " + relation)
    data = cur.fetchall()

    returnData = []

    for index in range(len(data)):
        returnData.append(data[index][1]) # Appending the name of each item, not its num/id

    return returnData