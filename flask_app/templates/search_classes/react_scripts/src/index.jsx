import React from 'react';
import ReactDOM from 'react-dom';
import filter_classes from "./filter_classes";
import RangeSlider from "./RangeSlider.js";
import AutocompleteMultiple from "./AutocompleteMultiple";
import TimePicker from "./TimePicker";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

const filter_functions = [];
const filter_keys = [];
const filter_elements = [];


function FilterElement(input_element, index) {
    const theme = createMuiTheme({
        palette: {
            primary: {
                main: "#000000",
            },
            secondary: {
                main: '#f44336',
            },
        },
    });
    return (
        <div key={index}>
            <ThemeProvider theme={theme}>
                <div className="m-2 mt-3 border-bottom">
                    {input_element}
                </div>
            </ThemeProvider>
        </div>

    );
}

function filter_classes_wrapper() {
    filter_classes(classes_list, filter_keys, filter_functions);
}

function get_values(key) {
    const values = [];
    for (let i = 0; i < classes_list.length; i++)
        values.push(classes_list[i][key]);
    return values;

}

function add_slider(label, key, key_num) {
    filter_keys.push(key);
    const index = filter_keys.length - 1;
    const cred = get_values(key_num);
    const min = Math.min.apply(Math, cred);
    const max = Math.max.apply(Math, cred);
    const input_element = RangeSlider(label, max, min, index, filter_functions, filter_classes_wrapper);
    filter_elements.push(FilterElement(input_element, index));
}

function add_multi_select(label, key) {
    filter_keys.push(key);
    const index = filter_keys.length - 1;
    const attributes = Array.from(new Set(get_values(key).flat()));
    const input_element = AutocompleteMultiple(label, attributes, index, filter_functions, filter_classes_wrapper);
    filter_elements.push(FilterElement(input_element, index));
}

add_slider("Remaining Slots", "rem", "rem");
add_slider("Credits", "cred", "cred_num");
add_multi_select("Tags", "attributes");
add_multi_select("Instructors", "instructors");
add_multi_select("Subject", "subj");


ReactDOM.render(
    // <div>{filter_elements}</div>,
    FilterElement(<TimePicker time={"00:00:00"}/>, 0),
    document.getElementById("filters_container")
);


filter_classes_wrapper()

