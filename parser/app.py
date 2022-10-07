from flask import Flask, abort, redirect, request
from werkzeug.utils import secure_filename
import subprocess
import json
import os

UPLOAD_FOLDER = 'uploads'
if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'replay'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


## A method that will call rattletrap.exe executable with the input file
## and return the output as a JSON object
def rattletrap(input):
    output = subprocess.run(['./rattletrap.12-ubuntu', "-i", input], stdout=subprocess.PIPE)
    return json.loads(output.stdout)

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
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return rattletrap(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
        <input type=file name=file>
        <input type=submit value=Upload>
    </form>
    '''