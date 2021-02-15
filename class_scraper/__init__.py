import os

os.chdir(os.path.dirname(os.path.dirname(__file__)))
dirs = ["data", "data/requirements_xml"]
[os.mkdir(n) for n in dirs if not os.path.exists(n)]