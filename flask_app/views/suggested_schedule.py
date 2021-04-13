from flask import Blueprint, render_template, request
import os
import json
from flask_login import login_required
from scripts.suggested_schedule import create_reqs_df, naive
from flask_app.utils import get_known_majors

path = os.path.dirname(__file__)
suggested_schedule_blueprint = Blueprint("suggested_schedule", __name__)

js_path = os.path.join(os.path.dirname(path), "templates/suggested_schedule/react_scripts/dist/main.js")
majors, known_majors = get_known_majors()


@suggested_schedule_blueprint.route('/suggested_schedule')
def suggested_schedule():
    with open(js_path, "r", encoding="utf8") as f:
        js = f.read()
    return render_template("suggested_schedule/suggested_schedule.html",
                           js=js,
                           majors=json.dumps(majors),
                           known_majors=json.dumps(known_majors))


@suggested_schedule_blueprint.route("/suggested_schedule_post", methods=['POST'])
def upload_transcript():
    course_code = request.data.decode("utf-8")
    return json.dumps(naive(create_reqs_df(course_code)))
