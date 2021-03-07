from flask import Blueprint, render_template, redirect, request, abort

from flask_app import app
import os
from scripts.transcript_parser import parse_transcript

upload_transcript_blueprint = Blueprint("upload_transcript", __name__)


@upload_transcript_blueprint.route('/upload_transcript')
def upload_transcript():
    return render_template("upload_transcript/upload_transcript.html", any=False, filename=None, data=None)


@upload_transcript_blueprint.route('/upload_transcript', methods=['POST'])
def upload_transcript_post():
    uploaded_file = request.files['file']
    filename = uploaded_file.filename
    if filename != '':
        file_ext = os.path.splitext(filename)[1]
        # if the file doesn't have a .html extension, abort
        # this might not be a good way to do this (it isn't)
        if file_ext not in app.config['UPLOAD_EXTENSIONS']:
            abort(400)

        uploaded_file.save(uploaded_file.filename)
        page = open(filename)
        courses = parse_transcript(page)

        return render_template("upload_transcript/upload_transcript.html", any=True, name=filename, data=courses)

    return redirect("/search_classes")

