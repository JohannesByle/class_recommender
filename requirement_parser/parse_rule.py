from . import remove_nests, switch
from . import parse_xml


def parse_if_statement(courses, node):
    if_else = "IfPart" if node.find("BooleanEvaluation").text == "True" else "ElsePart"
    return parse_xml(courses, node.find("Requirement").find(if_else))


def parse_group(courses, node):
    num_groups = int(node.find("Requirement").attrib["NumGroups"])
    reqs_satisfied = [parse_rule(courses, n) for n in node.findall("Rule")]
    num_satisfied = len([n for n in reqs_satisfied if (n[0] if isinstance(n, tuple) else all(n.values()))])
    return num_satisfied >= num_groups, remove_nests(reqs_satisfied)


def parse_subset(courses, node):
    assert all([n.tag == "Qualifier" for n in node.find("Requirement")])
    assert all([n.tag in ["IfElsePart", "Remark", "Requirement", "Rule"] for n in node])
    return remove_nests([parse_rule(courses, n) for n in node.findall("Rule")])


def parse_rule(courses, node):
    fun = switch({"IfStmt": parse_if_statement, "Group": parse_group, "Subset": parse_subset}, node.attrib["RuleType"])
    to_return = fun(courses, node) if fun else [parse_xml(courses, n) for n in node]
    if node.attrib["RuleType"] == "IfStmt":
        return remove_nests(to_return)
    else:
        return {node.attrib["Label"]: remove_nests(to_return)}
