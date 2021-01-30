import requests
from bs4 import BeautifulSoup
import pandas as pd
import os
from tqdm import tqdm
import pickle
import re
import sys
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from xml.etree import ElementTree

sys.setrecursionlimit(10000)

os.chdir(os.path.dirname(__file__))
if not os.path.exists("cache"):
    os.mkdir("cache")
base_url = "https://catalog.wheaton.edu"


def get_soup(url):
    with requests.session() as s:
        return BeautifulSoup(s.get(base_url + url).text, features="html.parser")


def is_class(string):
    string = "".join(n for n in string if n.isprintable())
    if "& " in string:
        strings = string.split("& ")
        return str((is_class(strings[0])), (is_class(strings[1])))
    result = re.search(r"([A-Z]+(?:/[A-Z]+)?)\ ?(\d{3})", string)
    if result:
        return result[1], result[2]
    return None


def is_cred(num):
    result = re.search(r"(\d+)", str(num))
    if result:
        return int(result[1])
    return None


def table_to_json(dfs):
    json_data = {"special_rules": [], "required_classes": []}
    if not isinstance(dfs, list):
        dfs = [dfs]
    for df in dfs:
        print(df)
        for col in df.columns:
            df[col] = df[col].apply(lambda x: ''.join(n for n in x if n.isprintable()) if isinstance(x, str) else x)
        if list(df.columns) == [0, 1]:
            json_data["special_rules"] += list(df[1])
        elif list(df.columns) == ["Code", "Title", "Credits"]:
            for index, row in df.iterrows():
                course = is_class(row["Code"])
                cred = is_cred(row["Credits"])
                if course and cred:
                    json_data["required_classes"] += [([course], cred)]
                if (not course) and cred:
                    json_data["required_classes"] += [([], cred)]
                if course and (not cred):
                    temp_tuple = json_data["required_classes"][-1]
                    json_data["required_classes"][-1] = (temp_tuple[0] + [course], temp_tuple[1])

                # print("{}: {}".format(row["Code"], row["Credits"]))
                # print("{}: {}".format(course, cred))
    return json_data


def scrape_requirements():
    landing_page = get_soup("/undergraduate/arts-sciences/")
    dfs = {}
    for major in tqdm(landing_page.find("ul", id="/undergraduate/arts-sciences/").find_all("li")):
        url = major.find("a").get("href").replace("#", "")
        name = major.find("a").get_text()
        dfs[name] = {}
        multiple_programs = get_soup(url).find(id=url)
        if multiple_programs:
            programs = [n.find("a").get("href") for n in multiple_programs.find_all("li")]
        else:
            programs = [url]
        for program in programs:
            try:
                dfs[name][os.path.basename(program[:-1])] = pd.read_html(base_url + program)
            except ValueError:
                continue
    with open("cache/requirements.p", "wb") as f:
        pickle.dump(dfs, f)


def scrape_table(url):
    soup = get_soup(url)
    code_cols = []
    courses = []
    for table in soup.find_all("table", class_="sc_courselist"):
        for tr in table.find_all("tr"):
            classes = tr.get("class")
            cells_classes = [td.get("class") for td in tr.find_all("td")]
            cells_values = [td.get_text() for td in tr.find_all("td")]
            cred = is_cred(cells_values[cells_classes.index(["hourscol"])]) if ["hourscol"] in cells_classes else None
            course = is_class(cells_values[cells_classes.index(["codecol"])]) if ["codecol"] in cells_classes else None
            if (not course) and cred:
                courses += [([], cells_values[cells_classes.index(["hourscol"])])]
            if course and not cred:
                courses[-1] = (courses[-1][0] + [course], courses[-1][1])
            if course and cred:
                courses += [(course, cred)]
            if ["codecol"] in cells_classes:
                code_cols.append(
                    [is_class(td.get_text()) for td in tr.find_all("td")][cells_classes.index(["codecol"])])

    [print(n) for n in courses]

    return soup


def convert_to_json(filename, output_filename):
    with open(filename) as f:
        text = f.read()
    new_json = {}
    for line in text.split("\n"):
        pair = line.split(": ")
        if len(pair) == 1:
            new_json[pair[0]] = ""
        else:
            new_json[pair[0]] = pair[1]
    with open(output_filename, "w") as f:
        json.dump(new_json, f)
    return new_json


def scrape_requirements():
    auth_data = {"j_username": os.environ["PORTAL_USER_ID"], "j_password": os.environ["PORTAL_PASSWORD"]}
    with open("dw_json/test.json") as f:
        dw_data = json.load(f)
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome("chromedriver.exe", options=chrome_options)
    url = "https://degreeworks.wheaton.edu/DashboardServlet/"
    driver.get(url)
    for key in auth_data:
        driver.find_element_by_name(key).send_keys(auth_data[key])
    driver.find_element_by_name("_eventId_proceed").click()
    while driver.current_url != url:
        continue
    cookies = driver.get_cookies()
    with requests.session() as s:
        for cookie in cookies:
            s.cookies.set(cookie['name'], cookie['value'])
        s.get(url)
        p = s.post("https://degreeworks.wheaton.edu/DashboardServlet/dashboard", data=dw_data)
        with open("temp.html", "w") as f:
            f.write(p.text)


root = ElementTree.parse("temp.html").getroot()

tags = []


def print_recursive(node, tab=0):
    if isinstance(node, tuple):
        indent = "".join(["\t"] * tab)
        if isinstance(node[1], list):
            print(indent + str(node[0]))
            [print_recursive(n, tab + 1) for n in node[1]]
        else:
            print(indent + str(node))
    else:
        [print_recursive(n, tab + 1) for n in node]


def parse_rule(rule):
    children = [n.tag for n in rule]
    label = rule.attrib["Label"]
    if rule.attrib["RuleType"] == "IfStmt":
        is_else = "IfElsePart" in children and rule[children.index("IfElsePart")].text == "ElsePart"
        boolean = rule[children.index("BooleanEvaluation")].text == "True"
        requirement_children = rule.find("Requirement")
        requirement_children_tags = [n.tag for n in requirement_children]
        name = "ElsePart" if (is_else or not boolean) and "ElsePart" in requirement_children_tags else "IfPart"
        return parse_xml(requirement_children[requirement_children_tags.index(name)])
    elif rule.attrib["RuleType"] == "Course":
        if len(rule.findall("Requirement")) > 1:
            raise Exception("More than one requirement")
        return label, parse_req(rule.find("Requirement"))
    elif rule.attrib["RuleType"] == "Group":
        return (label, rule.find("Requirement").attrib["NumGroups"]), parse_xml(rule)
    else:
        return label, parse_xml(rule)


def parse_req(req):
    if req.attrib["Class_cred_op"] != "OR":
        raise Exception("Not or exception")
    return [(n.attrib["Disc"], n.attrib["Num"]) for n in req.findall("Course")]


def parse_xml(node):
    if node.tag == "Block" and node.attrib["Req_type"] == "DEGREE":
        return
    return [n for n in [parse_rule(n) if n.tag == "Rule" else parse_xml(n) for n in node] if n]
