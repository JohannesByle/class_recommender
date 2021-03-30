from warnings import warn
from xml.etree import ElementTree
import itertools
from abc import ABC, abstractmethod


class Requirement(ABC):
    sat_courses = None
    name = None
    weight = None

    @abstractmethod
    def __init__(self):
        pass

    @abstractmethod
    def is_satisfied(self, courses):
        pass


def switch(functions, option, ignored=None, silent=True):
    if option in functions:
        return functions[option]
    else:
        if not (ignored and option in ignored) and not silent:
            warn("'{}' is not a known option".format(option), stacklevel=3)
            return
        return


def flatten(array):
    if not isinstance(array, list) or not all([isinstance(n, list) for n in array]):
        return array
    return [n for n in list(itertools.chain.from_iterable(array)) if n]


def parse_xml(node):
    from .parse_rule import parse_rule
    from .parse_requirement import parse_requirement
    if node.tag == "Block" and node.attrib["Req_type"] == "DEGREE":
        return []
    ignored = ["Classes_applied", "Credits_applied", "ClassesApplied"]
    fun = switch({"Rule": parse_rule, "Requirement": parse_requirement}, node.tag, ignored=ignored)
    to_return = fun(node) if fun else [parse_xml(n) for n in node]
    return flatten(to_return)


def requirements_satisfied(filename):
    xml = ElementTree.parse(filename)
    return parse_xml(xml.getroot())
