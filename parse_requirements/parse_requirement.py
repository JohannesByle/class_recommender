import pandas as pd
from . import switch


def parse_with(courses, node):
    assert all([n in ["Code", "Operator", "Connector", "HideFromAdvice"] for n in node.attrib])
    assert node.attrib["Code"] in ["ATTRIBUTE"] or node.attrib["Code"].startswith("DW")
    sat_courses = courses.copy()
    if node.attrib["Code"] == "ATTRIBUTE":
        tags = [n.text for n in node.findall("Value")]
        sat_courses = sat_courses[sat_courses["ATTRIBUTE"].apply(lambda x: all([n in x for n in tags]))]
    return sat_courses


def parse_course(courses, node):
    sat_courses = courses.copy()
    for attrib in ["Disc", "Num"]:
        sat_courses[attrib] = sat_courses[attrib].astype(str)
        sat_courses = sat_courses[sat_courses[attrib].str.match(node.attrib[attrib].replace("@", ".+"))]
    for child_node in node:
        fun = switch({"With": parse_with}, child_node.tag)
        sat_courses = fun(sat_courses, child_node) if fun else None
    return sat_courses


def parse_exception(courses, node):
    assert all([n.tag in ["Course"] for n in node])
    sat_courses = courses.copy()
    for course in node.findall("Course"):
        majors_match = sat_courses["Disc"] == course.attrib["Disc"]
        nums_match = sat_courses["Num"] == course.attrib["Num"]
        sat_courses = sat_courses[~(majors_match & nums_match)]
    return sat_courses


def parse_requirement(courses, node):
    tracked_attributes = ["Classes_begin", "Class_cred_op", "Connector", "Credits_end", "Credits_begin"]
    assert all([n.tag in ["Course", "Qualifier", "Except"] for n in node])
    assert all([n in tracked_attributes for n in node.attrib])
    sat_courses_all = pd.DataFrame()
    for course in node.findall("Course"):
        sat_courses_all = pd.concat([sat_courses_all, parse_course(courses, course)])
    for exception in node.findall("Exception"):
        sat_courses_all = parse_course(sat_courses_all, exception)
    satisfied = not sat_courses_all.empty
    if "Classes_begin" in node.attrib and satisfied:
        satisfied = len(sat_courses_all.index) >= int(node.attrib["Classes_begin"])
    if "Credits_begin" in node.attrib and satisfied:
        satisfied = pd.to_numeric(sat_courses_all["Credits"]).sum() >= int(node.attrib["Credits_begin"])
    return satisfied
