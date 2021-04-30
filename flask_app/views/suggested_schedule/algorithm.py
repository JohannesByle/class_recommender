import pandas as pd
from scripts.requirement_parser import parse_xml
from xml.etree import ElementTree
import os
import json
from scripts.class_functions import extract_attributes, get_min_max
from tqdm import tqdm
from datetime import datetime
import numpy as np

path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
with open(os.path.join(path, "scripts/class_scraper/class_conversion.json"), "r") as f:
    conversion_dict = json.load(f)
column_conversion = {"attribute": "ATTRIBUTE", "crse": "Num", "subj": "Disc", "cred": "Credits"}


def convert_df_to_degree_works(input_df):
    output_df = input_df.copy()
    output_df = output_df.rename(axis=1, mapper={conversion_dict[n]: n for n in conversion_dict})
    output_df = output_df.rename(axis=1, mapper=column_conversion)
    return output_df


def clean_df(input_df):
    output_df = input_df.copy()
    output_df = convert_df_to_degree_works(output_df)
    output_df = output_df[list(column_conversion.values()) + ["title", "term"]]
    output_df["Credits"] = output_df["Credits"].apply(lambda x: get_min_max(str(x))[0] if x else x)
    output_df = output_df[~((output_df["Credits"] == 0) & (output_df["Num"].astype(str).str.endswith("L")))]
    output_df["term"] = output_df["term"].str.replace(" Term", "")
    years = output_df["term"].apply(lambda x: int(x[-2:]))
    output_df = output_df[years >= years.max() - 4]
    rows = []
    for index, data in tqdm(output_df.groupby(by=["Disc", "Num", "title"])):
        rows.append({"Disc": index[0],
                     "Num": index[1],
                     "title": index[2],
                     "Credits": data["Credits"].max(),
                     "terms": set(data["term"].unique()),
                     "ATTRIBUTE": data.loc[data["ATTRIBUTE"].apply(lambda x: len(str(x))).idxmax(), "ATTRIBUTE"]})
    output_df = pd.DataFrame(rows)
    output_df["ATTRIBUTE"] = output_df["ATTRIBUTE"].apply(lambda x: extract_attributes(str(x)) if x else x)
    return output_df


courses_df = clean_df(pd.read_csv(os.path.join(path, "scripts/class_scraper/data/courses.csv")))


def create_reqs_df(major):
    root = ElementTree.parse(
        os.path.join(path, "scripts/class_scraper/data/requirements_xml/{}.xml").format(major)).getroot()
    reqs = parse_xml(root)
    [req.set_courses(courses_df) for req in reqs]
    reqs_df = pd.DataFrame(index=courses_df.index, columns=[req.name for req in reqs])
    for req in reqs:
        reqs_df[req.name] = req.sat_courses
    reqs_df = reqs_df[reqs_df.apply(lambda x: any(x), axis=1)]
    return reqs_df, {req.name: req for req in reqs}


def naive(reqs_df_input, reqs, credits_per_semester=18):
    def get_weights(bool_df_input):
        bool_df = bool_df_input.copy()
        for index, row in bool_df.iterrows():
            for col, value in dict(row).items():
                if value:
                    bool_df.loc[index, col] = reqs[col].is_satisfied(courses_df.loc[[index]]) * reqs[col].weight
        bool_df = bool_df.replace(False, 0)
        weights = bool_df.apply(lambda x: sum([n for n in x - reqs_weights if n > 0]), axis=1)
        weights = weights[weights > 0]
        return bool_df.loc[weights.sort_values(ascending=False).index]

    reqs_df = reqs_df_input.copy()
    reqs_df = reqs_df.loc[reqs_df.apply(lambda x: len([n for n in x if not n]), axis=1).sort_values().index]
    total_satisfied_reqs = []
    semesters = []
    reqs_weights = np.array([0 for n in reqs_df.columns])
    while not total_satisfied_reqs == list(reqs):
        credits_taken = 0
        semesters.append([])
        while credits_taken < credits_per_semester:
            fits_remaining = courses_df.loc[reqs_df.index, "Credits"] <= credits_per_semester - credits_taken
            weights_df = get_weights(reqs_df.loc[fits_remaining])
            if weights_df.empty:
                break
            course = dict(courses_df.loc[weights_df.index[0]])
            for key in course:
                if isinstance(course[key], set):
                    course[key] = list(course[key])
            semesters[-1].append(course)
            credits_taken += course["Credits"]
            reqs_weights = np.array(weights_df.iloc[0]) + reqs_weights
            reqs_df = reqs_df.drop(weights_df.index[0])
            yield {"schedule": semesters, "unsatisfied": []}
        if not semesters[-1]:
            semesters = [n for n in semesters if n]
            break

    unsatisfied = [reqs_df.columns[n] for n in range(len(reqs_weights)) if reqs_weights[n] == 0]

    yield {"schedule": semesters, "unsatisfied": unsatisfied}
