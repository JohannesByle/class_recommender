from xml.etree import ElementTree
import os
import json
from warnings import warn
import pandas as pd

os.chdir(os.path.dirname(__file__))
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


def switch(functions, option, ignored=None):
    if option in functions:
        return functions[option]
    else:
        if not (ignored and option in ignored):
            # warn("'{}' is not a known option".format(option), stacklevel=3)
            return
        return


def remove_nests(array):
    if isinstance(array, list):
        array = [n for n in array if not (isinstance(n, list) and not n)]
        if len(array) == 1:
            array = array[0]
    return array


def rule_if_statement(courses, node):
    if_else = "ElsePart" if node.find("BooleanEvaluation").text == "True" else "IfPart"
    return requirements_satisfied(courses, node.find("Requirement").find(if_else))


def rule_group(courses, node):
    num_groups = int(node.find("Requirement").attrib["NumGroups"])
    reqs_satisfied = [parse_rule(courses, n) for n in node.findall("Rule")]
    num_satisfied = len([n for n in reqs_satisfied if (n[0] if isinstance(n, tuple) else all(n.values()))])
    return num_satisfied >= num_groups, remove_nests(reqs_satisfied)


def rule_subset(courses, node):
    assert all([n.tag == "Qualifier" for n in node.find("Requirement")])
    assert all([n.tag in ["IfElsePart", "Remark", "Requirement", "Rule"] for n in node])
    return remove_nests([parse_rule(courses, n) for n in node.findall("Rule")])


def parse_rule(courses, node):
    fun = switch({"IfStmt": rule_if_statement, "Group": rule_group, "Subset": rule_subset}, node.attrib["RuleType"])
    to_return = fun(courses, node) if fun else [requirements_satisfied(courses, n) for n in node]
    if node.attrib["RuleType"] == "IfStmt":
        return remove_nests(to_return)
    else:
        return {node.attrib["Label"]: remove_nests(to_return)}


def parse_requirement(courses, node):
    tracked_attributes = ["Classes_begin", "Class_cred_op", "Connector", "Credits_end", "Credits_begin"]
    assert all([n.tag in ["Course", "Qualifier"] for n in node])
    assert all([n.attrib["Name"] == "LOWESTPRIORITY" for n in node.findall("Qualifier")])
    assert all([n in tracked_attributes for n in node.attrib])
    sat_courses_all = pd.DataFrame()
    for course in node.findall("Course"):
        sat_courses = courses.copy()
        assert all([n.tag in ["With"] for n in course])
        for attrib in ["Disc", "Num"]:
            sat_courses[attrib] = sat_courses[attrib].astype(str)
            sat_courses = sat_courses[sat_courses[attrib].str.match(course.attrib[attrib].replace("@", ".+"))]
        for with_node in course.findall("With"):
            assert all([n in ["Code", "Operator", "Connector"] for n in with_node.attrib])
            assert with_node.attrib["Code"] in ["DWTERM", "ATTRIBUTE"]
            if with_node.attrib["Code"] == "ATTRIBUTE":
                tags = [n.text for n in with_node.findall("Value")]
                sat_courses = sat_courses[sat_courses["ATTRIBUTE"].apply(lambda x: all([n in x for n in tags]))]
        sat_courses_all = pd.concat([sat_courses_all, sat_courses])
    satisfied = not sat_courses_all.empty
    if "Classes_begin" in node.attrib and satisfied:
        satisfied = len(sat_courses_all.index) >= int(node.attrib["Classes_begin"])
    if "Credits_begin" in node.attrib and satisfied:
        satisfied = pd.to_numeric(sat_courses_all["Credits"]).sum() >= int(node.attrib["Credits_begin"])
    return satisfied


def requirements_satisfied(courses, node):
    if node.tag == "Block" and node.attrib["Req_type"] == "DEGREE":
        return []
    ignored = ["Classes_applied", "Credits_applied", "ClassesApplied"]
    fun = switch({"Rule": parse_rule, "Requirement": parse_requirement}, node.tag, ignored=ignored)
    to_return = fun(courses, node) if fun else [requirements_satisfied(courses, n) for n in node]
    return remove_nests(to_return)
