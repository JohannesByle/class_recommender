from selenium import webdriver
import os
from selenium.webdriver.support.select import Select
import pandas as pd
from tqdm import tqdm

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

# Scrape the course data by clicking through each class
dfs = []
for n in tqdm(range(len(driver.find_elements_by_css_selector("input[value='View Sections']")))):
    inputs = driver.find_elements_by_css_selector("input[value='View Sections']")
    inputs[n].click()
    table = pd.read_html(driver.find_element_by_xpath("//body").get_attribute('outerHTML'))[5]
    major = table.columns.get_level_values(0)[0]
    if [n for n in table.columns.get_level_values(0) if n != major]:
        raise Exception("Not just one major")
    dfs.append(table[major])
    driver.back()
pd.concat(dfs).reset_index(drop=True).to_feather("courses.feather")
