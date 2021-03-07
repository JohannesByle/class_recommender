from flask import Blueprint, render_template, redirect, request
from scripts.transcript_parser import parse_transcript

upload_transcript_blueprint = Blueprint("upload_transcript", __name__)


@upload_transcript_blueprint.route('/upload_transcript')
def upload_transcript():
    return render_template("upload_transcript/upload_transcript.html")


@upload_transcript_blueprint.route('/upload_transcript', methods=['POST'])
def upload_transcript_post():
    # transcript = request.form.get('userFile')
    # print(transcript)
    # url = r'C:\Users\Sharon\Downloads\AcademicTranscript.html'
    # page = open(url)
    # courses = parse_transcript(page)
    # courses.to_html()

    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        uploaded_file.save(uploaded_file.filename)


    return redirect("/sign_up")

