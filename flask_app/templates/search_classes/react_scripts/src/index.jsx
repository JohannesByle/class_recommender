import React from 'react';
import ReactDOM from 'react-dom';
import filter_classes from "./filter_classes";
import RangeSlider from "./RangeSlider.js";


const filter_functions = [];
const filter_keys = [];
const filter_elements = [];
function filter_classes_wrapper() {
    filter_classes(classes_list, filter_keys, filter_functions);
}

filter_keys.push("rem");
filter_elements.push(RangeSlider("Open Slots", 36, 0, filter_keys.length - 1, filter_functions, filter_classes_wrapper))
filter_keys.push("cred")
filter_elements.push(RangeSlider("Credits", 8, 0, filter_keys.length - 1, filter_functions, filter_classes_wrapper))

ReactDOM.render(
    <div>{filter_elements}</div>,
    document.getElementById("filters_container")
);

filter_classes_wrapper()

