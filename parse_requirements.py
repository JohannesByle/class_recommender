from xml.etree import ElementTree
import os
import json

os.chdir(os.path.dirname(__file__))
if not os.path.exists("data"):
    os.mkdir("data")
if not os.path.exists("data/requirements_json"):
    os.mkdir("data/requirements_json")


def print_recursive(node, tab=0):
    indent = "".join(["\t"] * tab)
    if isinstance(node, dict) and "Label" in node:
        how_many = "Any"
        if node["Type"] == "Subset":
            how_many = "All"
        elif node["Type"] == "Group":
            how_many = "Choose {}".format(node["Num Required"])
        print("{}{} - {}".format(indent, node["Label"], how_many))
        [print_recursive(n, tab + 1) for n in node["Rule"]]
    elif isinstance(node, dict) and "Course" in node:
        print(indent + str(list(node["Course"].values())))
    elif isinstance(node, list):
        [print_recursive(n, tab + 1) for n in node]


def parse_rule(rule):
    children = [n.tag for n in rule]
    label = rule.attrib["Label"]
    rule_type = rule.attrib["RuleType"]
    if rule_type == "IfStmt":
        is_else = "IfElsePart" in children and rule[children.index("IfElsePart")].text == "ElsePart"
        boolean = rule[children.index("BooleanEvaluation")].text == "True"
        requirement_children = rule.find("Requirement")
        requirement_children_tags = [n.tag for n in requirement_children]
        name = "ElsePart" if (is_else or not boolean) and "ElsePart" in requirement_children_tags else "IfPart"
        return parse_xml(requirement_children[requirement_children_tags.index(name)])
    elif rule_type == "Course":
        if len(rule.findall("Requirement")) > 1:
            raise Exception("More than one requirement")
        return {"Label": label, "Rule": parse_req(rule.find("Requirement")), "Type": rule_type}
    elif rule_type == "Group":
        return {"Label": label, "Num Required": rule.find("Requirement").attrib["NumGroups"],
                "Rule": parse_xml(rule), "Type": rule_type}
    else:
        return {"Label": label, "Rule": parse_xml(rule), "Type": rule_type}


def parse_req(req):
    def parse_course(course):
        course_data = {"Course": {"Name": course.attrib["Disc"], "Number": course.attrib["Num"]}}
        children_tags = [n.tag for n in course]
        if "With" in children_tags:
            with_node = course[children_tags.index("With")]
            course_data["Course"][with_node.attrib["Code"]] = [n.text for n in with_node if n.tag == "Value"][0]
        return course_data

    if req.attrib["Class_cred_op"] != "OR":
        raise Exception("Not or exception")
    return [parse_course(n) for n in req.findall("Course")]


def parse_xml(node):
    if node.tag == "Block" and node.attrib["Req_type"] == "DEGREE":
        return
    rules = [parse_rule(n) if n.tag == "Rule" else parse_xml(n) for n in node]
    to_return_rules = []
    for rule in rules:
        if not rule:
            continue
        if isinstance(rule, list) and len(rule) == 1:
            to_return_rules.append(rule[0])
            continue
        to_return_rules.append(rule)
    if len(to_return_rules) == 1:
        to_return_rules = to_return_rules[0]
    return to_return_rules


def convert_xml():
    reqs_dir = "data/requirements_xml"
    for file in os.listdir(reqs_dir):
        with open("data/requirements_json/" + file.replace(".xml", ".json"), "w") as f:
            json.dump(parse_xml(ElementTree.parse(reqs_dir + "/" + file).getroot()), f)
