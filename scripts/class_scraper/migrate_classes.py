import pandas as pd
from flask_app import db
from models import Class
import os
from tqdm import tqdm


def migrate_classes():
    path = os.path.dirname(__file__)
    df = pd.read_pickle(os.path.join(path, "data/courses.p"))
    print(list(df.columns))
    for index, row in tqdm(df.iterrows(), total=len(df.index)):
        new_course = dict(
            term=row["Associated Term"],
            crn=row["CRN"],
            subj=row["Subj"],
            crse=row["Crse"],
            sec=row["Sec"],
            cmp=row["Cmp"],
            cred=row["Cred"],
            title=row["Title"],
            days=row["Days"],
            time=row["Time"],
            cap=row["Cap"],
            act=row["Act"],
            rem=row["Rem"],
            wl_cap=row["WL Cap"],
            wl_act=row["WL Act"],
            wl_rem=row["WL Rem"],
            xl_cap=row["XL Cap"],
            xl_act=row["XL Act"],
            xl_rem=row["XL Rem"],
            instructor=row["Instructor"],
            date=row["Date (MM/DD)"],
            location=row["Location"],
            attribute=row["Attribute"]
        )
        course = Class.query.filter_by(term=row["Associated Term"], crn=row["CRN"]).first()
        if course and not all([course.__dict__[n] == new_course[n] for n in new_course]):
            continue
        if course:
            course.data = new_course
        else:
            course = Class(**new_course)
            db.session.add(course)
        db.session.commit()
