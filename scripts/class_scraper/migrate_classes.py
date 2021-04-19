import pandas as pd
from flask_app import db
from models import Class
import os
from tqdm import tqdm
import json

path = os.path.dirname(__file__)
with open(os.path.join(path, "class_conversion.json"), "r") as f:
    conversion_dict = json.load(f)


def migrate_classes():
    df = pd.read_pickle(os.path.join(path, "data/courses.p"))
    for index, row in tqdm(df.iterrows(), total=len(df.index)):
        new_course = {n: row[conversion_dict[n]] for n in conversion_dict}
        course = Class.query.filter_by(term=row["Associated Term"], crn=row["CRN"]).first()
        if course and not all([course.__dict__[n] == new_course[n] for n in new_course]):
            continue
        if course:
            course.data = new_course
        else:
            course = Class(**new_course)
            db.session.add(course)
        db.session.commit()
