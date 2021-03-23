import pandas as pd
from . import switch, courses_df


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
        courses = courses[courses[attrib].str.match(node.attrib[attrib].replace("@", ".+"))]
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

    def requirement_function(courses):
        sat_courses = pd.DataFrame()
        possible_sat_courses = pd.DataFrame()
        for course_node in node.findall("Course"):
            sat_courses = pd.concat([sat_courses, parse_course(courses, course_node)])
            possible_sat_courses = pd.concat([sat_courses, parse_course(courses_df, course_node)])
        for exception_node in node.findall("Except"):
            sat_courses = parse_course(sat_courses, exception_node)
            possible_sat_courses = parse_course(courses_df, exception_node)
        min_weight = possible_sat_courses["Credits"][possible_sat_courses["Credits"] != 0].min()
        min_weight = min_weight if min_weight != 0 else 1
        weight = int(not courses.empty) * min_weight
        # if min_weight:
        #     print(possible_sat_courses[["title", "Credits"]].sort_values(by="Credits"))
        if bool(weight):
            assert not all([n in node.attrib for n in ["Classes_begin", "Credits_begin"]])
            if "Classes_begin" in node.attrib:
                num_classes = int(node.attrib["Classes_begin"])
                weight = int(len(courses.index) >= num_classes) * num_classes
                weight = weight * min_weight if num_classes > 0 else 0
            elif "Credits_begin" in node.attrib:
                num_credits = int(int(node.attrib["Credits_begin"]))
                weight = int(pd.to_numeric(courses["Credits"]).sum() >= num_credits) * num_credits
                weight = weight if num_credits > 0 else 0
        return weight

    return [requirement_function]
