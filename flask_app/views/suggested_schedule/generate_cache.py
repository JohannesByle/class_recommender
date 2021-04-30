from .algorithm import create_reqs_df
import os
import pickle
from tqdm import tqdm

path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
data_path = os.path.join(path, "flask_app/data/reqs_data")
if not os.path.exists(data_path):
    os.mkdir(data_path)
xml_path = os.path.join(path, "scripts/class_scraper/data/requirements_xml")


def generate_cache():
    for file in tqdm(os.listdir(xml_path)):
        new_file = file.replace(".xml", ".p")
        with open(os.path.join(data_path, new_file), "wb") as f:
            pickle.dump(create_reqs_df(file.replace(".xml", "")), f)
