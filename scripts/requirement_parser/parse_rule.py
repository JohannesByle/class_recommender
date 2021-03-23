from . import switch, flatten, courses_df
from . import parse_xml
import pandas as pd


def parse_if_statement(node):
    if_else = "IfPart" if node.find("BooleanEvaluation").text == "True" else "ElsePart"
    return parse_xml(node.find("Requirement").find(if_else))


def parse_group(node):
    num_groups = int(node.find("Requirement").attrib["NumGroups"])
    reqs_satisfied = flatten([parse_rule(n) for n in node.findall("Rule")])

    def requirement_function(courses, return_weight=False):
        satisfied = [n["function"](courses) for n in reqs_satisfied]
        num_satisfied = len([n for n in satisfied if n[0]])
        sat_courses = pd.concat([n[1] for n in satisfied])
        satisfied = num_satisfied >= num_groups
        if not return_weight:
            return satisfied, sat_courses
        else:
            weight_ = sum(sorted([n["weight"] for n in reqs_satisfied if not pd.isna(n)])[:num_groups])
            return satisfied, sat_courses, weight_

    _, _, weight = requirement_function(courses_df, return_weight=True)
    return [(requirement_function, weight)]


def parse_subset(node):
    assert all([n.tag == "Qualifier" for n in node.find("Requirement")])
    assert all([n.tag in ["IfElsePart", "Remark", "Requirement", "Rule"] for n in node])
    return flatten([parse_rule(n) for n in node.findall("Rule")])


def parse_rule(node):
    fun = switch({"IfStmt": parse_if_statement, "Group": parse_group, "Subset": parse_subset}, node.attrib["RuleType"])
    to_return = fun(node) if fun else flatten([parse_xml(n) for n in node])
    if node.attrib["RuleType"] == "IfStmt":
        return to_return
    else:
        if len(to_return) == 1:
            return [{"name": node.attrib["Label"], "function": to_return[0][0], "weight": to_return[0][1]}]
        else:
            for item in to_return:
                if not item:
                    continue
                item["name"] = "{}, {}".format(node.attrib["Label"], item["name"])
            return to_return
