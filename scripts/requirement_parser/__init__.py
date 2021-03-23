from warnings import warn
from xml.etree import ElementTree
import numpy as np
import itertools
import os
import pandas as pd
import json
from scripts.class_functions import extract_attributes, get_min_max

path = os.path.dirname(__file__)
with open(os.path.join(path, "../class_scraper/class_conversion.json"), "r") as f:
    conversion_dict = json.load(f)
column_conversion = {"attribute": "ATTRIBUTE", "crse": "Num", "subj": "Disc", "cred": "Credits"}


def convert_df_to_degree_works(input_df):
    output_df = input_df.copy()
    output_df = output_df.rename(axis=1, mapper={conversion_dict[n]: n for n in conversion_dict})
    output_df = output_df.rename(axis=1, mapper=column_conversion)
    output_df["ATTRIBUTE"] = output_df["ATTRIBUTE"].apply(lambda x: extract_attributes(str(x)) if x else x)
    return output_df


def clean_df(input_df):
    output_df = input_df.copy()
    output_df = convert_df_to_degree_works(output_df)
    output_df["Credits"] = output_df["Credits"].apply(lambda x: get_min_max(str(x))[0] if x else x)
    years = output_df["term"].apply(lambda x: int(x[-2:] if "Term" not in x else x[-7:-5]))
    output_df = output_df[years >= years.max() - 4]
    return output_df


courses_df = clean_df(pd.read_pickle(os.path.join(path, "../class_scraper/data/courses.p")))


def switch(functions, option, ignored=None, silent=True):
    if option in functions:
        return functions[option]
    else:
        if not (ignored and option in ignored) and not silent:
            warn("'{}' is not a known option".format(option), stacklevel=3)
            return
        return


def flatten(array):
    if not isinstance(array, list) or not all([isinstance(n, list) for n in array]):
        return array
    return [n for n in list(itertools.chain.from_iterable(array)) if n]


def parse_xml(node):
    from .parse_rule import parse_rule
    from .parse_requirement import parse_requirement
    if node.tag == "Block" and node.attrib["Req_type"] == "DEGREE":
        return []
    ignored = ["Classes_applied", "Credits_applied", "ClassesApplied"]
    fun = switch({"Rule": parse_rule, "Requirement": parse_requirement}, node.tag, ignored=ignored)
    to_return = fun(node) if fun else [parse_xml(n) for n in node]
    return flatten(to_return)


def requirements_satisfied(filename):
    xml = ElementTree.parse(filename)
    return parse_xml(xml.getroot())
