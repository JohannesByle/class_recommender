import React from 'react';
import ReactDOM from 'react-dom';
import filter_classes from "./filter_classes";
import RangeSlider from "./RangeSlider.js";
import AutocompleteMultiple from "./AutocompleteMultiple";

var filter_functions = [];
var filter_keys = [];
var filter_elements = [];
function filter_classes_wrapper() {
    filter_classes(classes_list, filter_keys, filter_functions);
}
function get_values(key) {
    var values = [];
    for (var i = 0; i < classes_list.length; i++) {
        values.push(classes_list[i][key]);
    }return values;
}

function add_slider(label, key, key_num) {
    filter_keys.push(key);
    var cred = get_values(key_num);
    var min = Math.min.apply(Math, cred);
    var max = Math.max.apply(Math, cred);
    filter_elements.push(RangeSlider(label, max, min, filter_keys.length - 1, filter_functions, filter_classes_wrapper));
}

function add_multi_select(label, key) {
    filter_keys.push(key);
    var attributes = Array.from(new Set(get_values(key).flat()));
    filter_elements.push(AutocompleteMultiple(label, attributes, filter_keys.length - 1, filter_functions, filter_classes_wrapper));
}

add_slider("Remaining Slots", "rem", "rem");
add_slider("Credits", "cred", "cred_num");
add_multi_select("Tags", "attributes");
add_multi_select("Instructors", "instructor");
add_multi_select("Subject", "subj");

ReactDOM.render(React.createElement(
    'div',
    null,
    filter_elements
), document.getElementById("filters_container"));

filter_classes_wrapper();