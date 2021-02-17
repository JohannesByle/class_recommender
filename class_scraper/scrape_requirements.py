import requests
import os
from tqdm import tqdm
import sys
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
import time

sys.setrecursionlimit(10000)


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


def get_wait(f, max_tries=20):
    tries = 0
    while True:
        to_return = f()
        if to_return:
            return to_return
        time.sleep(1)
        tries += 1
        if tries > max_tries:
            raise Exception("Took too long to load")


def scrape_requirements(update_majors_list=False):
    auth_data = {"j_username": os.environ["PORTAL_USER_ID"], "j_password": os.environ["PORTAL_PASSWORD"]}
    print("Starting chromedriver")
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_experimental_option("detach", True)
    driver = webdriver.Chrome(options=chrome_options)
    url = "https://degreeworks.wheaton.edu/DashboardServlet/"
    driver.get(url)
    for key in auth_data:
        driver.find_element_by_name(key).send_keys(auth_data[key])
    driver.find_element_by_name("_eventId_proceed").click()
    print("Waiting for DegreeWorks")
    while driver.current_url != url:
        continue
    if update_majors_list:
        print("Updating majors list")
        driver.switch_to.frame("frBodyContainer")
        driver.switch_to.frame("frLeft")
        get_wait(lambda: driver.find_elements_by_css_selector("li[title='What If']"))[0].click()
        driver.switch_to.default_content()
        driver.switch_to.frame("frBodyContainer")
        driver.switch_to.frame("frBody")
        programs = {}
        minors = {}
        programs_select = Select(driver.find_element_by_id("PROGRAMPICK"))
        options = programs_select.options
        for n in range(len(options)):
            option = options[n]
            code = option.get_attribute("value")
            if (not code or not code.startswith("UG")) or option.text.startswith("Cert"):
                continue
            programs_select.select_by_index(n)
            n = 0
            while len(Select(driver.find_element_by_id("MAJORPICK")).options) < 2:
                time.sleep(0.5)
                n += 1
                if n > 10:
                    raise Exception("Majors won't load")

            def get_dict(el_id):
                select = Select(driver.find_element_by_id(el_id))
                options_dict = {}
                for option in select.options:
                    if option.get_attribute("value"):
                        options_dict[option.get_attribute("value")] = option.text
                return options_dict

            if not minors:
                minors = get_dict("MINORPICK")
            majors = get_dict("MAJORPICK")

            programs[code] = {"name": option.text, "majors": majors}
        with open("data/majors.json", "w") as f:
            json.dump(programs, f)
        with open("data/minors.json", "w") as f:
            json.dump(minors, f)
    cookies = driver.get_cookies()
    driver.quit()
    with requests.session() as s:
        for cookie in cookies:
            s.cookies.set(cookie['name'], cookie['value'])
        s.get(url)

        with open("post_forms/dw_what_if_major.json") as f:
            what_if_data_master = json.load(f)
        with open("data/majors.json") as f:
            majors = json.load(f)
        pbar = tqdm(total=sum([len(majors[n]["majors"]) for n in majors]))
        for program in majors:
            for major in majors[program]["majors"]:
                what_if_data = what_if_data_master.copy()
                pbar.update(1)
                what_if_data["BLOCKLIST"] = what_if_data["BLOCKLIST"].format(id=int(os.environ["STUDENT_ID"]),
                                                                             program=program, major=major)
                what_if_data["DEGREE"] = program[2:4]
                p = s.post("https://degreeworks.wheaton.edu/DashboardServlet/dashboard", data=what_if_data)
                save_file = "data/requirements_xml/{}_{}.xml".format(*[n.replace("/", "") for n in [program, major]])
                with open(save_file, "w") as f:
                    f.write(p.text)
