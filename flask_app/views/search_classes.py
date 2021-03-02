from flask import Blueprint, render_template, request, flash, redirect
import pandas as pd
from models import Class, extract_attributes
from flask_app import db

search_classes_blueprint = Blueprint("search_classes", __name__)


def df_from_sql():
    df = pd.read_sql(Class.query.statement, db.engine)
    df["term"] = df["term"].apply(lambda x: x.replace(" Term", ""))
    df["attributes"] = df["attribute"].apply(lambda x: extract_attributes(str(x)))
    df = df[df["term"] == "Spring 2021"]
    return df


classes_df = df_from_sql()


@search_classes_blueprint.route('/search_classes')
def search_classes():
    return render_template("search_classes/search_classes.html", classes_list=classes_df.to_json(orient="records"))
