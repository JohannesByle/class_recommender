from flask import Blueprint, render_template, redirect, request, abort
import os
from .parse_transcript import parse_transcript
from flask_login import login_required

path = os.path.dirname(__file__)
js_path = os.path.join(os.path.dirname(os.path.dirname(path)), "templates/my_classes/react_scripts/dist/main.js")
my_classes_blueprint = Blueprint("my_classes", __name__)


@my_classes_blueprint.route("/my_classes")
@login_required
def my_classes():
    with open(js_path, "r", encoding="utf8") as f:
        js = f.read()
    return render_template("my_classes/my_classes.html", js=js)


@my_classes_blueprint.route("/upload_transcript", methods=['POST'])
@login_required
def upload_transcript():
    courses = parse_transcript(request.data.decode("utf-8"))
    return courses.to_json(orient="records")
