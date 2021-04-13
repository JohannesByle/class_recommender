import json
import os

path = os.path.dirname(__file__)


def get_known_majors():
    data_path = os.path.join(os.path.dirname(path), "scripts/class_scraper/data")
    with open(os.path.join(data_path, "majors.json"), "r") as f:
        majors = json.load(f)
    known_majors = {}
    for program in majors:
        for major in majors[program]["majors"]:
            code = "{}_{}".format(*[n.replace("/", "") for n in [program, major]])
            if os.path.exists(os.path.join(data_path, "requirements_xml/{}.xml".format(code))):
                known_majors["{} {}".format(majors[program]["majors"][major].strip(), program[-2:])] = code
    known_majors = {k: v for k, v in sorted(known_majors.items(), key=lambda item: item[1])}
    return majors, known_majors
