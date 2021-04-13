import pandas as pd
from models import Class
from scripts.class_functions import get_time, extract_attributes, get_min_max, get_date
from flask_app import db
from tqdm import tqdm


def get_quads(df):
    df["quad"] = None
    for term, data in df.groupby("term"):
        if "Summer" in term:
            continue
        dates = data["date"].value_counts().index[:3]
        start_end = [(int(n[:2]), int(n[-5:-3])) for n in dates]
        durations = [n[1] - n[0] for n in start_end]
        assert len([n for n in durations if n == 4]) <= 1
        dates = [dates[n] for n in range(3) if durations[n] != 4]
        start_end = [start_end[n] for n in range(3) if durations[n] != 4]
        if start_end[0][0] < start_end[1][0]:
            a_quad = dates[0]
            b_quad = dates[1]
        else:
            a_quad = dates[1]
            b_quad = dates[0]
        df.loc[df["date"] == a_quad, "quad"] = "A"
        df.loc[df["date"] == b_quad, "quad"] = "B"
    return df


def get_offered_terms(df):
    df["offered_terms"] = None
    years = df["year"].unique()

    for index, data in tqdm(df.groupby(["subj", "crse", "title"])):
        offered_terms = list(data["term"].unique())
        semesters = []
        for semester in set([n[:-5] for n in offered_terms]):
            if len([n for n in offered_terms if semester in n]) >= len(set(years)) - 1:
                semesters.append("Every {} semester".format(semester))
                offered_terms = [n for n in offered_terms if semester not in n]
        offered_terms_readable = semesters + offered_terms
        df.loc[data.index, "offered_terms"] = pd.Series(index=data.index, data=[offered_terms] * len(data.index))
        df.loc[data.index, "offered_terms_readable"] = pd.Series(index=data.index,
                                                                 data=[offered_terms_readable] * len(data.index))
    return df


def term_to_float(term):
    year = int(term[-4:])
    if "Spring" in term:
        term = year
    elif "Summer" in term:
        term = year + 1 / 3
    elif "Fall" in term:
        term = year + 2 / 3
    else:
        assert False
    return term


def df_from_sql():
    df = pd.read_sql(Class.query.statement, db.engine)
    df["term"] = df["term"].apply(lambda x: x.replace(" Term", ""))
    df["year"] = df["term"].apply(lambda x: int(x[-4:]))
    df = df[df["year"] > df["year"].max() - 5]
    df = get_quads(df)
    df = get_offered_terms(df)
    df["attributes"] = df["attribute"].apply(lambda x: extract_attributes(str(x)))
    df["instructor"] = df["instructor"].apply(lambda x: str(x).replace(" (P)", ""))
    df["instructors"] = df["instructor"].apply(lambda x: x.split(", "))
    df["cred"] = df["cred"].apply(lambda x: str(x).replace(".000", "").replace(".0", ""))
    df["cred_num"] = df["cred"].apply(lambda x: [abs(n) for n in get_min_max(x)])
    df["rem_num"] = df["rem"].apply(lambda x: get_min_max(x))
    df["start_time"] = df["time"].apply(lambda x: get_time(x)[0])
    df["end_time"] = df["time"].apply(lambda x: get_time(x)[1])
    df["start_date"] = df["date"].apply(lambda x: get_date(x)[0])
    df["end_date"] = df["date"].apply(lambda x: get_date(x)[1])
    df["time"] = df["time"].apply(lambda x: str(x).replace(" ", ""))
    df["days_list"] = df["days"].apply(lambda x: list(x) if x and x != "TBA" else "TBA")
    df["term_float"] = df["term"].apply(lambda x: term_to_float(x))
    return df
