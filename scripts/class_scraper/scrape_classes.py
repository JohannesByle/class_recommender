import requests
import os
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm
import json
import re

requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS += ':HIGH:!DH:!aNULL'
auth_data = {"sid": os.environ["PORTAL_USER_ID"], "PIN": os.environ["PORTAL_PASSWORD"]}


def clean_df(df):
    df = df.dropna(subset=["CRN"]).drop_duplicates().reset_index(drop=True)
    df = df[df["Associated Term"] != "Associated Term"]
    df = df[[not all([df.iloc[n, 0] == df.iloc[n, i] for i in range(len(df.iloc[n]))]) for n in range(len(df.index))]]
    df["CRN"] = df["CRN"].astype(int)
    return df


def get_desc(session, subj, crse):
    url_template = "https://catalog.wheaton.edu/ribbit/index.cgi?page=getcourse.rjs&code={subj}%20{crse}"
    soup = BeautifulSoup(session.get(url_template.format(subj=subj, crse=crse)).text, features="lxml")
    desc = soup.find(class_="courseblockdesc")
    desc = desc.get_text() if desc else desc
    co_reqs = None
    pre_reqs = None
    if desc:
        co_req_start = desc.find("Pre or Corequisite:")
        pre_req_start = desc.find("Prerequisite:")
        pre_req_start = pre_req_start if pre_req_start != -1 else desc.find("Prerequisites:")
        if pre_req_start:
            co_reqs = re.findall(r"[A-Z]{3,6}\s\d{3}[A-Z]?", desc[co_req_start: pre_req_start])
        pre_reqs = re.findall(r"[A-Z]{3,6}\s\d{3}[A-Z]?", desc[pre_req_start:])
    return {"desc": desc, "co_reqs": co_reqs, "pre_reqs": pre_reqs}


def course_to_pandas(html):
    table = pd.read_html(html)[5]
    year = table.columns.get_level_values(0)[0]
    assert not [n for n in table.columns.get_level_values(0) if n != year]
    major = table[year].columns.get_level_values(0)[0]
    assert not [n for n in table[year].columns.get_level_values(0) if n != major]
    return table[year][major]


def form_to_json(html, action):
    soups = BeautifulSoup(html, features="lxml").find_all("form", action=action)
    data = []
    for soup in soups:
        temp_data = []
        for input_el in soup.find_all("input"):
            if input_el.has_attr("name") and input_el.has_attr("value"):
                temp_data.append((input_el["name"], input_el["value"]))
        for select_el in soup.find_all("select"):
            name = select_el["name"]
            for option_el in select_el.find_all("option"):
                temp_data.append((name, option_el["value"]))
        data.append(temp_data)
    return data


def get_course(subject, course, year):
    with open("post_forms/bannerweb.json", "r") as f:
        post_data = json.load(f)
    replacements = {"sel_subj": str(subject), "SEL_CRSE": str(course), "term_in": str(year)}
    for n in range(len(post_data)):
        if post_data[n][0] in replacements:
            post_data[n][1] = replacements[post_data[n][0]]
    with requests.session() as s:
        s.get("https://bannerweb.wheaton.edu/db1/bwckgens.p_proc_term_date")
        s.post("https://bannerweb.wheaton.edu/db1/twbkwbis.P_ValLogin", data=auth_data)
        p = s.post("https://bannerweb.wheaton.edu/db1/bwskfcls.P_GetCrse", data=post_data)
        return course_to_pandas(p.text)


def get_all_courses():
    dfs = []
    with requests.session() as s:
        s.get("https://bannerweb.wheaton.edu/db1/bwckgens.p_proc_term_date")
        s.post("https://bannerweb.wheaton.edu/db1/twbkwbis.P_ValLogin", data=auth_data)
        p = s.get("https://bannerweb.wheaton.edu/db1/bwskfcls.p_sel_crse_search")
        form = form_to_json(p.text, "/db1/bwckgens.p_proc_term_date")[0]
        years = [n for n in form if n[0] == "p_term" and n[1]]
        form_master = [n for n in form if n[0] != "p_term"]
        years_form = [("term_in", n[1]) for n in years]
        courses = []
        for year in years[:12]:
            form = form_master + [year]
            p = s.post("https://bannerweb.wheaton.edu/db1/bwckgens.p_proc_term_date", data=form)
            form = form_to_json(p.text, "/db1/bwskfcls.P_GetCrse")[0]
            form.append(("SEL_CRSE", "dummy"))
            form.append(("SEL_TITLE", "dummy"))
            p = s.post("https://bannerweb.wheaton.edu/db1/bwskfcls.P_GetCrse", data=form)
            forms = form_to_json(p.text, "/db1/bwskfcls.P_GetCrse")
            for form in tqdm(forms, desc=str(year)):
                subj = [n[1] for n in form if n[0] == "sel_subj" and n[1] != "dummy"][0]
                course = [n[1] for n in form if n[0] == "SEL_CRSE"][0]
                if not (subj, course) in courses:
                    courses.append((subj, course))
                    p = s.post("https://bannerweb.wheaton.edu/db1/bwskfcls.P_GetCrse", data=form + years_form)
                    dfs.append(course_to_pandas(p.text))
        clean_df(pd.concat(dfs)).to_pickle("data/courses.p")
