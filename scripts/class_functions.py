import json
import os
import re

import pandas as pd

with open(os.path.join(os.path.dirname(__file__), "tags.json"), "r") as f:
    tags = json.load(f)


def extract_attributes(attribute_string):
    return [tags[n] for n in attribute_string.split(" and ") if n in tags]


def get_time(time_str):
    match = re.findall(r"\d{2}:\d{2} (?:am|pm)", time_str)
    if not len(match) == 2:
        return None, None
    else:
        times = []
        for time in match:
            hour, minute = re.findall(r"\d{2}", time)
            if "pm" in time:
                hour = int(hour) + 12 - 1
            times.append(pd.Timestamp(hour=int(hour), minute=int(minute), year=2000, month=1, day=1).isoformat())
        return times


def get_date(date_str):
    match = re.findall(r"\d{2}/\d{2}", date_str)
    if not len(match) == 2:
        return None, None
    else:
        dates = []
        for time in match:
            month, day = re.findall(r"\d{2}", time)
            dates.append(pd.Timestamp(year=2000, month=int(month), day=int(day)).isoformat())
        return dates


def get_min_max(num_string):
    num_string = str(num_string)
    matches = re.findall(r"-?\d+\.*\d*", num_string)
    if matches:
        numbers = [float(n) for n in matches]
        return [min(numbers), max(numbers)]
    else:
        return [None, None]
