from scripts.suggested_schedule import create_reqs_df
from scripts.suggested_schedule import courses_df
import os
from tqdm import tqdm
import json

path = os.path.dirname(__file__)
data_path = os.path.join(path, "class_scraper/data/requirements_xml")
save_path = os.path.join(os.path.dirname(path), "flask_app/data")
for file in tqdm(os.listdir(data_path)):
    major = file.replace(".xml", "")
    df, _ = create_reqs_df(major)
    reqs_dict = {}
    for index, row in df.iterrows():
        course = courses_df.loc[index]
        if not course["Disc"] in reqs_dict:
            reqs_dict[course["Disc"]] = {}
        reqs_dict[course["Disc"]][course["Num"]] = list(df.columns[df.loc[index]])
    with open(os.path.join(save_path, "{}.json".format(major)), "w") as f:
        json.dump(reqs_dict, f)
