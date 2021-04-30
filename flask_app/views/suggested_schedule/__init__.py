from flask import Blueprint, render_template, request
import json
from .algorithm import naive, create_reqs_df
from flask_app.utils import get_known_majors
from random import random
import threading
import os

path = os.path.dirname(__file__)
task_path = os.path.join(path, "tasks")
path = os.path.dirname(path)
if not os.path.exists(task_path):
    os.mkdir(task_path)

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
def start_suggested_schedule_task():
    course_code = request.data.decode("utf-8")
    task_id = None
    while not task_id or os.path.exists(os.path.join(task_path, task_id)):
        task_id = str(int(random() * 10 ** 10)) + ".json"
    new_thread = threading.Thread(target=naive_task, args=(course_code, task_id))
    new_thread.start()
    return json.dumps(task_id)


@suggested_schedule_blueprint.route("/suggested_schedule_status_post", methods=['POST'])
def get_suggested_schedule_task():
    task_id = request.data.decode("utf-8")
    if os.path.exists(os.path.join(task_path, task_id)):
        with open(os.path.join(task_path, task_id), "r") as f:
            to_return = json.load(f)
            if to_return["done"]:
                os.remove(os.path.join(task_path, task_id))
            return json.dumps(to_return)
    else:
        return json.dumps("Task not found")


def naive_task(course_code, task_id):
    update = None
    with open(os.path.join(task_path, task_id), "w") as f:
        new_dict = {"done": False}
        json.dump(new_dict, f)
    for update in naive(*create_reqs_df(course_code)):
        with open(os.path.join(task_path, task_id), "w") as f:
            new_dict = {"done": False}
            new_dict.update(**update)
            json.dump(new_dict, f)
    with open(os.path.join(task_path, task_id), "w") as f:
        new_dict = {"done": True}
        new_dict.update(**update)
        json.dump(new_dict, f)
