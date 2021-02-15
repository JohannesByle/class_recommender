import os
from warnings import warn
import pandas as pd

os.chdir(os.path.dirname(os.path.dirname(__file__)))
if not os.path.exists("data"):
    os.mkdir("data")
if not os.path.exists("data/requirements_json"):
    os.mkdir("data/requirements_json")


def print_recursive(array, tab=0):
    indent = "".join(["\t"] * tab)
    if isinstance(array, dict):
        print(indent + str(list(array.keys())[0]))
        print_recursive(list(array.values())[0], tab=tab + 1)
    elif isinstance(array, list):
        for item in array:
            print_recursive(item, tab=tab + 1)
    elif isinstance(array, tuple):
        print(indent + str(array[0]))
        print_recursive(array[0], tab=tab + 1)
    elif isinstance(array, str) or isinstance(array, bool):
        print(indent + str(array))


def switch(functions, option, ignored=None, silent=True):
    if option in functions:
        return functions[option]
    else:
        if not (ignored and option in ignored) and not silent:
            warn("'{}' is not a known option".format(option), stacklevel=3)
            return
        return


def remove_nests(array):
    if isinstance(array, list):
        array = [n for n in array if not (isinstance(n, list) and not n)]
        if len(array) == 1:
            array = array[0]
    return array


def parse_xml(courses, node):
    from .parse_rule import parse_rule
    from .parse_requirement import parse_requirement
    if node.tag == "Block" and node.attrib["Req_type"] == "DEGREE":
        return []
    ignored = ["Classes_applied", "Credits_applied", "ClassesApplied"]
    fun = switch({"Rule": parse_rule, "Requirement": parse_requirement}, node.tag, ignored=ignored)
    to_return = fun(courses, node) if fun else [parse_xml(courses, n) for n in node]
    return remove_nests(to_return)
