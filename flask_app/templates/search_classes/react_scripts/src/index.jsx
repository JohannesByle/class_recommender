import React from 'react';
import ReactDOM from 'react-dom';
import filter_classes from "./filter_classes";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

export const filter_functions = [];
export const filter_keys = [];
export const filter_elements = [];


export function FilterElement(input_element, index) {
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
                <div className="m-2 mt-3">
                    {input_element}
                </div>
            </ThemeProvider>
        </div>

    );
}

export function get_values(key) {
    const values = [];
    for (let i = 0; i < classes_list.length; i++)
        values.push(classes_list[i][key]);
    return values;

}

import {showArchived} from "./filter_classes";
import add_slider from "./RangeSlider";
import add_multi_select from "./AutocompleteMultiple";
import add_time_picker from "./TimePicker";

filter_elements.push(FilterElement(showArchived(), 0));
add_slider("Remaining Slots", "rem_num");
add_slider("Credits", "cred_num");
add_multi_select("Tags", "attributes", true);
add_multi_select("Instructors", "instructors", false);
add_multi_select("Subject", "subj");
add_multi_select("Days", "days_list", true);
add_multi_select("Title", "title");
add_multi_select("Term", "term");
add_time_picker("Starts after", "start_time", "00:00:00", false);
add_time_picker("Ends before", "end_time", "23:59:59", true);


ReactDOM.render(
    <div>{filter_elements}</div>,
    // FilterElement(<TimePicker time={"00:00:00"}/>, 0),
    document.getElementById("filters_container")
);


filter_classes()

