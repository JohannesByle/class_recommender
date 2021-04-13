import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {filter_elements, filter_functions, filter_keys, get_values, FilterElement} from "../index";
import filter_classes from "../filter_classes";
import {Switch} from "@material-ui/core";
import ReactDOM from "react-dom";


function AutocompleteMultiple(label, options, index, is_and) {
    options.sort()

    function filter_function(e, val) {
        filter_functions[index] = (x) => {
            if (val.length === 0)
                return true;
            if (is_and) {
                for (let i = 0; i < val.length; i++) {
                    if (!x.includes(val[i]))
                        return false;
                }
                return true;
            } else {
                for (let i = 0; i < val.length; i++) {
                    if (x.includes(val[i]))
                        return true;
                }
                return false;
            }
        };
        filter_classes();
    }

    function switch_and_or(e, val) {
        is_and = val
        ReactDOM.render(
            <div>{is_and ? "and" : "or"}</div>,
            document.getElementById(index.toString() + "toggle_label")
        )
        filter_classes();
    }

    let and_or_switch = null;
    if (is_and != null) {
        and_or_switch = (
            <div className="col-2 text-center small p-0">
                <Switch
                    color="primary"
                    size="small"
                    onChange={switch_and_or}
                    defaultChecked={is_and}
                />
                <span id={index.toString() + "toggle_label"} className="small">{is_and ? "and" : "or"}</span>
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col">
                <Autocomplete
                    multiple
                    onChange={filter_function}
                    options={options}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label={label}
                            placeholder={label}
                        />
                    )}
                    style={{maxWidth: is_and == null ? null : 169}}
                />
            </div>
            {and_or_switch}
        </div>
    );
}

export default function add_multi_select(label, key, is_and) {
    filter_keys.push(key);
    const index = filter_keys.length - 1;
    const attributes = Array.from(new Set(get_values(key).flat()));
    const input_element = AutocompleteMultiple(label, attributes, index, is_and);
    filter_elements.push(FilterElement(input_element, index));
}