import pandas as pd
from scripts.requirement_parser import parse_xml
from xml.etree import ElementTree
import os
import json
from scripts.class_functions import extract_attributes, get_min_max

path = os.path.dirname(os.path.dirname(__file__))
with open(os.path.join(path, "class_scraper/class_conversion.json"), "r") as f:
    conversion_dict = json.load(f)
column_conversion = {"attribute": "ATTRIBUTE", "crse": "Num", "subj": "Disc", "cred": "Credits"}


def convert_df_to_degree_works(input_df):
    output_df = input_df.copy()
    output_df = output_df.rename(axis=1, mapper={conversion_dict[n]: n for n in conversion_dict})
    output_df = output_df.rename(axis=1, mapper=column_conversion)
    output_df = output_df[list(column_conversion.values()) + ["title", "term"]]
    output_df = output_df.drop_duplicates(subset=list(column_conversion.values()) + ["title"])
    output_df["ATTRIBUTE"] = output_df["ATTRIBUTE"].apply(lambda x: extract_attributes(str(x)) if x else x)
    return output_df


def clean_df(input_df):
    output_df = input_df.copy()
    output_df = convert_df_to_degree_works(output_df)
    output_df["Credits"] = output_df["Credits"].apply(lambda x: get_min_max(str(x))[0] if x else x)
    years = output_df["term"].apply(lambda x: int(x[-2:] if "Term" not in x else x[-7:-5]))
    output_df = output_df[years >= years.max() - 4]
    return output_df


courses_df = clean_df(pd.read_pickle(os.path.join(path, "class_scraper/data/courses.p")))


def create_reqs_df(major):
    root = ElementTree.parse(os.path.join(path, "class_scraper/data/requirements_xml/{}.xml").format(major)).getroot()
    reqs = parse_xml(root)
    [req.__init__(req, courses_df) for req in reqs]
    reqs_df = pd.DataFrame(index=courses_df.index, columns=[req.name for req in reqs])
    for req in reqs:
        reqs_df[req.name] = req.sat_courses
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
