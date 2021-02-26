from bs4 import BeautifulSoup
import os
import pandas as pd
import re
import json
from flask_app import static

courses_df = pd.read_pickle(os.path.join(os.path.dirname(os.path.dirname(__file__)), "class_scraper/data/courses.p"))
with open(os.path.join(os.path.dirname(__file__), "tags.json"), "r") as f:
    tags = json.load(f)


def get_extra_course_data(disc, num):
    df = courses_df.copy()
    df = df[(df["Subj"] == disc) & (df["Crse"].astype(str) == num)]
    df["Attribute"] = df["Attribute"].astype(str).apply(lambda x: [tags[n] for n in x.split(" and ") if n in tags])
    attributes = df["Attribute"].iloc[0]
    return {"ATTRIBUTE": attributes}


def parse_transcript(html_str):
    courses = []
    soup = BeautifulSoup(html_str, features="lxml")
    for tr in soup.find("table", class_="datadisplaytable").find_all("tr"):
        cells = [td.text for td in tr.find_all("td")]
        if len(cells) < 2:
            continue
        if re.match(r"^[A-Z]{3,4}$", cells[0]) and re.match(r"^(\d|x){3}$", cells[1]):
            subj, number = cells[:2]
            cells = cells[3:] if re.match(r"^[A-Z]{2}$", cells[2]) else cells[2:]
            name = cells[0]
            grade, cred = [None, cells[1]] if re.match(r"\d{1,2}\.\d{3}", cells[1].strip()) else cells[1:3]
            new_course = {"Disc": subj, "Num": number, "name": name, "grade": grade, "Credits": cred}
            new_course.update(get_extra_course_data(subj, number))
            courses.append(new_course)

    courses = pd.DataFrame(courses)
    courses["Credits"] = pd.to_numeric(courses["Credits"]).astype(int)
    return courses
