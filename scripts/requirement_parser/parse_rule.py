from . import switch, flatten
from . import parse_xml


def parse_if_statement(node):
    if_else = "IfPart" if node.find("BooleanEvaluation").text == "True" else "ElsePart"
    return parse_xml(node.find("Requirement").find(if_else))


def parse_group(node):
    num_groups = int(node.find("Requirement").attrib["NumGroups"])
    reqs_satisfied = flatten([parse_rule(n) for n in node.findall("Rule")])

    def requirement_function(courses):
        num_satisfied = sum([n["function"](courses) for n in reqs_satisfied])
        return num_satisfied if num_satisfied >= num_groups else 0

    return [requirement_function]


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
            return [{"name": node.attrib["Label"], "function": to_return[0]}]
        else:
            for item in to_return:
                if not item:
                    continue
                item["name"] = "{}, {}".format(node.attrib["Label"], item["name"])
            return to_return
