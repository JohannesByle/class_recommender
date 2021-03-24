import pandas as pd
from scripts.requirement_parser import parse_xml, courses_df
from xml.etree import ElementTree
import os

path = os.path.dirname(os.path.dirname(__file__))


def create_reqs_df(major):
    root = ElementTree.parse(os.path.join(path, "class_scraper/data/requirements_xml/{}.xml").format(major)).getroot()
    reqs = parse_xml(root)
    reqs_df = pd.DataFrame(index=courses_df.index, columns=[req["name"] for req in reqs])
    for req in reqs:
        _, sat_courses = req["function"](courses_df)
        for index, row in sat_courses.iterrows():
            reqs_df.loc[index, req["name"]] = req["weight"] if req["weight"] >= row["Credits"] else row["Credits"]
    reqs_df = reqs_df.fillna(0)
    return reqs_df


def naive(reqs_df_input, credits_per_semester=18):
    reqs_df = reqs_df_input.copy()
    satisfied_reqs = []
    semesters = []
    while not all([n in satisfied_reqs for n in reqs_df.columns]):
        cred = 0
        courses = []
        temp_courses = courses_df.copy()
        satisfied_reqs_original = satisfied_reqs.copy()
        while cred < credits_per_semester and not temp_courses.empty:
            temp_courses = temp_courses[temp_courses["Credits"] <= credits_per_semester - cred]
            weights = reqs_df.loc[temp_courses.index].sum(axis=1).sort_values(ascending=False)
            course = temp_courses.loc[weights.index[0]]
            temp_courses = temp_courses.loc[weights.index[1:]]
            courses.append(dict(course))
            cred += course["Credits"]
            reqs = reqs_df.loc[weights.index[0]]
            satisfied_reqs += list(reqs[reqs != 0].index)
            reqs_df = reqs_df[[n for n in reqs_df.columns if n not in satisfied_reqs]]
        semesters.append({"credit_hours": cred, "courses": courses})
        if satisfied_reqs_original == satisfied_reqs:
            break
    return {"schedule": semesters, "unsatisfied": [n for n in reqs_df.columns if n not in satisfied_reqs]}
