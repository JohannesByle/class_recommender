from flask import Blueprint, render_template, request, flash, redirect
import pandas as pd
from models import Class, extract_attributes, get_time
from flask_app import db
import re

search_classes_blueprint = Blueprint("search_classes", __name__)


def get_min_max(num_string):
    num_string = str(num_string)
    matches = re.findall(r"-?\d+\.*\d*", num_string)
    if matches:
        numbers = [float(n) for n in matches]
        return [min(numbers), max(numbers)]
    else:
        return [None, None]


def df_from_sql():
    df = pd.read_sql(Class.query.statement, db.engine)
    df["term"] = df["term"].apply(lambda x: x.replace(" Term", ""))
    df["attributes"] = df["attribute"].apply(lambda x: extract_attributes(str(x)))
    df["instructor"] = df["instructor"].apply(lambda x: str(x).replace(" (P)", ""))
    df["instructors"] = df["instructor"].apply(lambda x: x.split(", "))
    df["cred"] = df["cred"].apply(lambda x: str(x).replace(".000", "").replace(".0", ""))
    df["cred_num"] = df["cred"].apply(lambda x: get_min_max(x))
    df["rem_num"] = df["rem"].apply(lambda x: get_min_max(x))
    df["start_time"] = df["time"].apply(lambda x: get_time(x)[0])
    df["end_time"] = df["time"].apply(lambda x: get_time(x)[1])
    df["time"] = df["time"].apply(lambda x: str(x).replace(" ", ""))
    df["days_list"] = df["days"].apply(lambda x: list(x) if x and x != "TBA" else "TBA")
    df = df[df["term"] == "Spring 2021"]
    return df


classes_df = df_from_sql()


@search_classes_blueprint.route('/search_classes')
def search_classes():
    with open("flask_app/templates/search_classes/react_scripts/dist/main.js", "r", encoding="utf8") as f:
        js = f.read()
    return render_template("search_classes/search_classes.html", classes_list=classes_df.to_json(orient="records"),
                           js=js)
