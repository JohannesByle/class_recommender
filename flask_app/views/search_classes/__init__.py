from flask import Blueprint, render_template
import os
from .utils import df_from_sql
import json
from flask_app.utils import get_known_majors

path = os.path.dirname(os.path.dirname(__file__))
data_path = os.path.join(os.path.dirname(path), "data")
majors = [n.replace(".json", "") for n in os.listdir(data_path)]
_, known_majors = get_known_majors()
known_majors = {n: known_majors[n] for n in known_majors if known_majors[n] in majors}
js_path = os.path.join(os.path.dirname(path), "templates/search_classes/react_scripts/dist/main.js")
search_classes_blueprint = Blueprint("search_classes", __name__)

classes_df = df_from_sql()


@search_classes_blueprint.route('/search_classes')
def search_classes():
    with open(js_path, "r", encoding="utf8") as f:
        js = f.read()
    return render_template("search_classes/search_classes.html",
                           classes_list=classes_df.to_json(orient="records"),
                           js=js,
                           majors_list=json.dumps(known_majors))


@search_classes_blueprint.route('/search_classes/get_reqs/<major>')
def get_reqs(major):
    if major in majors:
        with open(os.path.join(data_path, major + ".json"), "r") as f:
            return json.dumps(json.load(f))
    return None
