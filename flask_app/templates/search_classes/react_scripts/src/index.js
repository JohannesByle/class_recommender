import React from 'react';
import ReactDOM from 'react-dom';
import filter_classes from "./filter_classes";
import RangeSlider from "./RangeSlider.js";

var filter_functions = [];
var filter_keys = [];
var filter_elements = [];
function filter_classes_wrapper() {
    filter_classes(classes_list, filter_keys, filter_functions);
}

filter_keys.push("rem");
filter_elements.push(RangeSlider("Open Slots", 36, 0, filter_keys.length - 1, filter_functions, filter_classes_wrapper));
filter_keys.push("cred");
filter_elements.push(RangeSlider("Credits", 8, 0, filter_keys.length - 1, filter_functions, filter_classes_wrapper));

ReactDOM.render(React.createElement(
    'div',
    null,
    filter_elements
), document.getElementById("filters_container"));

filter_classes_wrapper();