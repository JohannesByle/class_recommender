from selenium import webdriver
import os
from selenium.webdriver.support.select import Select
import pandas as pd
import numpy as np

# Initialize driver
driver = webdriver.Chrome()

# Login to the portal
driver.get("https://bannerweb.wheaton.edu/db1/bwckgens.p_proc_term_date")
driver.find_element_by_id("UserID").send_keys(os.environ["PORTAL_USER_ID"])
driver.find_element_by_id("PIN").send_keys(os.environ["PORTAL_PASSWORD"])
driver.find_element_by_xpath("/html/body/div[3]/form/p/input").click()

# Navigate to the classes selection screen
driver.get("https://bannerweb.wheaton.edu/db1/bwskfcls.p_sel_crse_search")
years = Select(driver.find_element_by_xpath("/html/body/div[3]/form/table/tbody/tr/td/select"))
years.select_by_index(1)
driver.find_element_by_xpath("/html/body/div[3]/form/input[2]").click()
majors = Select(driver.find_element_by_xpath('//*[@id="subj_id"]'))
[majors.select_by_index(n) for n in range(len(majors.options))]
driver.find_element_by_xpath("/html/body/div[3]/form/input[17]").click()

# Scrape the course data
df = pd.DataFrame(columns=["major", "Num", "Name"])
majors = driver.find_elements_by_class_name("datadisplaytable")
for major in majors:
    major_name = major.find_elements_by_class_name("ddheader")
    if not major_name:
        continue
    major_name = major_name[0].text
    courses = major.find_elements_by_class_name("dddefault")
    courses = np.array([n.text for n in courses])
    for course in courses.reshape(-1, 2):
        df = df.append({"major": major_name, "Num": course[0], "Name": course[1]}, ignore_index=True)

df.to_feather("courses.feather")
