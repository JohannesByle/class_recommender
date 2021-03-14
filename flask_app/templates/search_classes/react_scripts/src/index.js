import React from 'react';
import ReactDOM from 'react-dom';
import filter_classes from "./filter_classes";
import RangeSlider from "./RangeSlider.js";
import AutocompleteMultiple from "./AutocompleteMultiple";
import TimePicker from "./TimePicker";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

var filter_functions = [];
var filter_keys = [];
var filter_elements = [];

function FilterElement(input_element, index) {
    var theme = createMuiTheme({
        palette: {
            primary: {
                main: "#000000"
            },
            secondary: {
                main: '#f44336'
            }
        }
    });
    return React.createElement(
        'div',
        { key: index },
        React.createElement(
            ThemeProvider,
            { theme: theme },
            React.createElement(
                'div',
                { className: 'm-2 mt-3 border-bottom' },
                input_element
            )
        )
    );
}

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
    var index = filter_keys.length - 1;
    var cred = get_values(key_num);
    var min = Math.min.apply(Math, cred);
    var max = Math.max.apply(Math, cred);
    var input_element = RangeSlider(label, max, min, index, filter_functions, filter_classes_wrapper);
    filter_elements.push(FilterElement(input_element, index));
}

function add_multi_select(label, key) {
    filter_keys.push(key);
    var index = filter_keys.length - 1;
    var attributes = Array.from(new Set(get_values(key).flat()));
    var input_element = AutocompleteMultiple(label, attributes, index, filter_functions, filter_classes_wrapper);
    filter_elements.push(FilterElement(input_element, index));
}

add_slider("Remaining Slots", "rem", "rem");
add_slider("Credits", "cred", "cred_num");
add_multi_select("Tags", "attributes");
add_multi_select("Instructors", "instructors");
add_multi_select("Subject", "subj");

ReactDOM.render(
// <div>{filter_elements}</div>,
FilterElement(React.createElement(TimePicker, { time: "00:00:00" }), 0), document.getElementById("filters_container"));

filter_classes_wrapper();