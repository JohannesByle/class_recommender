from flask import Blueprint, render_template, request
import os
from .parse_transcript import parse_transcript
from flask_login import login_required, current_user
import pandas as pd
from flask_app import db
from models import Class
import json
import re

path = os.path.dirname(__file__)
js_path = os.path.join(os.path.dirname(os.path.dirname(path)), "templates/my_classes/react_scripts/dist/main.js")
my_classes_blueprint = Blueprint("my_classes", __name__)
courses_df = pd.read_sql(Class.query.statement, db.engine)

courses_dict = {}
for index, row in courses_df.iterrows():
    if row["subj"] not in courses_dict:
        courses_dict[row["subj"]] = {}
    if row["crse"] not in courses_dict[row["subj"]]:
        cred = int(re.findall(r"(\d+)\.?\d*$", row["cred"])[0])
        courses_dict[row["subj"]][row["crse"]] = {"title": row["title"], "cred": cred}


def add_class_to_db(new_class_dict):
    if new_class_dict not in current_user.classes:
        current_user.classes = current_user.classes + [new_class_dict]
        db.session.commit()
        return True
    return False


@my_classes_blueprint.route("/my_classes")
@login_required
def my_classes():
    with open(js_path, "r", encoding="utf8") as f:
        js = f.read()
    return render_template("my_classes/my_classes.html",
                           js=js,
                           courses_dict=json.dumps(courses_dict),
                           my_courses=json.dumps(current_user.classes))


@my_classes_blueprint.route("/upload_transcript", methods=['POST'])
@login_required
def upload_transcript():
    courses = parse_transcript(request.data.decode("utf-8"))
    for index_, row_ in courses.iterrows():
        add_class_to_db(dict(row_))
    return json.dumps(current_user.classes)


@my_classes_blueprint.route("/add_class", methods=['POST'])
@login_required
def add_class():
    new_class_dict = json.loads(request.data.decode("utf-8"))
    add_class_to_db(new_class_dict)
    return json.dumps(current_user.classes)