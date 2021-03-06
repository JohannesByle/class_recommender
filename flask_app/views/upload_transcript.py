from flask import Blueprint, render_template

upload_transcript_blueprint = Blueprint("upload_transcript", __name__)


@upload_transcript_blueprint.route('/upload_transcript')
def upload_transcript():
    return render_template("upload_transcript/upload_transcript.html")
