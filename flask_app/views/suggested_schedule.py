from flask import Blueprint, render_template, request
import os
import json
from flask_login import login_required
from scripts.suggested_schedule import create_reqs_df, naive

path = os.path.dirname(__file__)
suggested_schedule_blueprint = Blueprint("suggested_schedule", __name__)

js_path = os.path.join(os.path.dirname(path), "templates/suggested_schedule/react_scripts/dist/main.js")
data_path = os.path.join(os.path.dirname(os.path.dirname(path)), "scripts/class_scraper/data")
with open(os.path.join(data_path, "majors.json"), "r") as f:
    majors = json.load(f)
known_majors = {}
for program in majors:
    for major in majors[program]["majors"]:
        code = "{}_{}".format(*[n.replace("/", "") for n in [program, major]])
        if os.path.exists(os.path.join(data_path, "requirements_xml/{}.xml".format(code))):
            known_majors["{} {}".format(majors[program]["majors"][major].strip(), program[-2:])] = code
known_majors = {k: v for k, v in sorted(known_majors.items(), key=lambda item: item[1])}
known_majors = json.dumps(known_majors)
majors = json.dumps(majors)


@suggested_schedule_blueprint.route('/suggested_schedule')
def suggested_schedule():
    with open(js_path, "r", encoding="utf8") as f:
        js = f.read()
    return render_template("suggested_schedule/suggested_schedule.html",
                           js=js,
                           majors=majors,
                           known_majors=known_majors)


@suggested_schedule_blueprint.route("/suggested_schedule_post", methods=['POST'])
def upload_transcript():
    course_code = request.data.decode("utf-8")
    return json.dumps(naive(create_reqs_df(course_code)))
