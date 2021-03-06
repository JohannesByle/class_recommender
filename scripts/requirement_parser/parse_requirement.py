import pandas as pd
from . import switch, Requirement
import numpy as np


class BaseRequirement(Requirement):
    node = None

    def __init__(self, node):
        Requirement.__init__(self)
        self.node = node

    def set_courses(self, courses):
        sat_courses = pd.DataFrame(columns=courses.columns)
        for course_node in self.node.findall("Course"):
            sat_courses = pd.concat([sat_courses, parse_course(courses, course_node)])
        for exception_node in self.node.findall("Except"):
            sat_courses = parse_except(sat_courses, exception_node)
        self.sat_courses = pd.Series(index=courses.index, data=courses.index.isin(sat_courses.index))
        self.get_weight(courses)

    def get_weight(self, courses):
        sat_courses_sorted = courses[self.sat_courses].sort_values("Credits")
        assert not all([n in self.node.attrib for n in ["Classes_begin", "Credits_begin"]])
        if "Classes_begin" in self.node.attrib:
            if not sat_courses_sorted.empty:
                self.weight = int(sat_courses_sorted.iloc[:int(self.node.attrib["Classes_begin"])]["Credits"].sum())
        elif "Credits_begin" in self.node.attrib:
            self.weight = int(int(self.node.attrib["Credits_begin"]))
        else:
            self.weight = int(sat_courses_sorted.iloc[0, "Credits"])

    def is_satisfied(self, courses_input):
        courses = courses_input.loc[courses_input.index.intersection(self.sat_courses.index)]
        satisfied = int(not courses.empty)
        if satisfied == 0:
            return satisfied
        assert not all([n in self.node.attrib for n in ["Classes_begin", "Credits_begin"]])
        if "Classes_begin" in self.node.attrib:
            num_classes = int(self.node.attrib["Classes_begin"])
            if num_classes == 0:
                return 1
            satisfied = len(courses.index) / num_classes
        elif "Credits_begin" in self.node.attrib:
            num_credits = int(self.node.attrib["Credits_begin"])
            if num_credits == 0:
                return 1
            satisfied = pd.to_numeric(courses["Credits"]).sum() / num_credits
        satisfied = 1 if satisfied >= 1 else satisfied
        return satisfied


def parse_with(courses_input, node):
    courses = courses_input.copy()
    assert all([n in ["Code", "Operator", "Connector", "HideFromAdvice"] for n in node.attrib])
    assert node.attrib["Code"] in ["ATTRIBUTE"] or node.attrib["Code"].startswith("DW")
    if node.attrib["Code"] == "ATTRIBUTE":
        tags = [n.text for n in node.findall("Value")]
        courses = courses[courses["ATTRIBUTE"].apply(lambda x: any([n in x for n in tags]))]
    return courses


def parse_course(courses_input, node):
    courses = courses_input.copy()
    for attrib in ["Disc", "Num"]:
        courses[attrib] = courses[attrib].astype(str)
        courses = courses[courses[attrib].str.match("^" + node.attrib[attrib].replace("@", ".+") + "$")]
    for child_node in node:
        fun = switch({"With": parse_with}, child_node.tag)
        courses = fun(courses, child_node) if fun else None
    return courses


def parse_except(courses_input, node):
    courses = courses_input.copy()
    assert all([n.tag in ["Course"] for n in node])
    for course in node.findall("Course"):
        majors_match = courses["Disc"] == course.attrib["Disc"]
        nums_match = courses["Num"] == course.attrib["Num"]
        courses = courses[~(majors_match & nums_match)]
    return courses


def parse_requirement(node):
    tracked_attributes = ["Classes_begin", "Class_cred_op", "Connector", "Credits_end", "Credits_begin"]
    assert all([n.tag in ["Course", "Qualifier", "Except"] for n in node])
    assert all([n in tracked_attributes for n in node.attrib])
    req = BaseRequirement(node)
    return [req]
