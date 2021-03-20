from warnings import warn
from xml.etree import ElementTree
import numpy as np


def flatten_reqs(array, parent=None, depth=0):
    if isinstance(array, dict):
        assert len(array) == 1
        key = list(array.keys())[0]
        val = list(array.values())[0]
        new_parent = "{}: {}".format(parent, key) if parent else key
        if isinstance(val, bool) or isinstance(val, np.bool_):
            return {new_parent: {"satisfied": val, "weight": int(val), "depth": depth + 1}}
        else:
            return flatten_reqs(val, parent=new_parent, depth=depth + 1)
    elif isinstance(array, list):
        new_dict = {}
        for item in array:
            new_dict.update(flatten_reqs(item, parent=parent, depth=depth))
        return new_dict
    elif isinstance(array, tuple):
        assert isinstance(array[0], bool) or isinstance(array[0], np.bool_)
        assert all([isinstance(n, dict) for n in array[1]])
        child_reqs = flatten_reqs(array[1], parent=parent, depth=depth)
        child_reqs = {n: child_reqs[n] for n in child_reqs if child_reqs[n]["depth"] == depth + 1}

        new_weight = sum([child_reqs[n]["weight"] for n in child_reqs]) / len(child_reqs)
        for n in child_reqs:
            child_reqs[n]["weight"] = 0
        new_dict = {
            parent: {"satisfied": array[0], "weight": new_weight, "num_options": len(child_reqs), "depth": depth}}
        new_dict.update(child_reqs)
        return new_dict
    assert False


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


def requirements_satisfied(courses, filename):
    xml = ElementTree.parse(filename)
    return parse_xml(courses, xml.getroot())
