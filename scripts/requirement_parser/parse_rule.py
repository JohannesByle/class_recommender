from . import switch, flatten, parse_xml, Requirement
import pandas as pd


def parse_if_statement(node):
    if_else = "IfPart" if node.find("BooleanEvaluation").text == "True" else "ElsePart"
    return parse_xml(node.find("Requirement").find(if_else))


def parse_group(node):
    req = OptionRequirement(node)
    return [req]


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
            requirement = to_return[0]
            requirement.name = node.attrib["Label"]
            return [requirement]
        else:
            for requirement in to_return:
                requirement.name = "{}, {}".format(node.attrib["Label"], requirement.name)
            return to_return


class OptionRequirement(Requirement):
    node = None
    num_groups = None
    reqs_options = None

    def __init__(self, node):
        Requirement.__init__(self)
        self.node = node
        self.num_groups = int(self.node.find("Requirement").attrib["NumGroups"])
        self.reqs_options = flatten([parse_rule(n) for n in self.node.findall("Rule")])

    def set_courses(self, courses):
        [n.set_courses(courses) for n in self.reqs_options]
        courses_options = [n.sat_courses for n in self.reqs_options]
        sat_courses = pd.Series(index=courses.index)
        for n in sat_courses.index:
            sat_courses.loc[n] = any([courses_options[i].loc[n] for i in range(len(courses_options))])
        self.sat_courses = sat_courses
        self.get_weight()

    def get_weight(self):
        weights = sorted([n.weight for n in self.reqs_options if n.weight])
        if len(weights) >= self.num_groups:
            self.weight = sum(weights[:self.num_groups])

    def is_satisfied(self, courses):
        num_satisfied = len([n for n in self.reqs_options if n.is_satisfied(courses)])
        satisfied = num_satisfied / self.num_groups
        return 1 if satisfied >= 1 else satisfied
