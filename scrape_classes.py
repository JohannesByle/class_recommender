import requests
import os
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm


def course_to_pandas(html):
    table = pd.read_html(html)[5]
    major = table.columns.get_level_values(0)[0]
    if [n for n in table.columns.get_level_values(0) if n != major]:
        raise Exception("Not just one major")
    return table[major]


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


requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS += ':HIGH:!DH:!aNULL'
auth_data = {"sid": os.environ["PORTAL_USER_ID"], "PIN": os.environ["PORTAL_PASSWORD"]}


def get_all_courses(year):
    dfs = []
    with requests.session() as s:
        s.get("https://bannerweb.wheaton.edu/db1/bwckgens.p_proc_term_date")
        s.post("https://bannerweb.wheaton.edu/db1/twbkwbis.P_ValLogin", data=auth_data)
        p = s.get("https://bannerweb.wheaton.edu/db1/bwskfcls.p_sel_crse_search")
        form = form_to_json(p.text, "/db1/bwckgens.p_proc_term_date")[0]
        form = [n for n in form if n[0] != "p_term" or n[1] == year]
        p = s.post("https://bannerweb.wheaton.edu/db1/bwckgens.p_proc_term_date", data=form)
        form = form_to_json(p.text, "/db1/bwskfcls.P_GetCrse")[0]
        form.append(("SEL_CRSE", "dummy"))
        form.append(("SEL_TITLE", "dummy"))
        p = s.post("https://bannerweb.wheaton.edu/db1/bwskfcls.P_GetCrse", data=form)
        forms = form_to_json(p.text, "/db1/bwskfcls.P_GetCrse")
        for form in tqdm(forms):
            p = s.post("https://bannerweb.wheaton.edu/db1/bwskfcls.P_GetCrse", data=form)
            dfs.append(course_to_pandas(p.text))

    pd.concat(dfs).reset_index(drop=True).to_csv("cache/courses.csv")
