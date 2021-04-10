import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { filter_elements, filter_functions, filter_keys, get_values, FilterElement } from "./index";
import filter_classes from "./filter_classes";
import { Switch } from "@material-ui/core";
import ReactDOM from "react-dom";

function AutocompleteMultiple(label, options, index, is_and) {
    function filter_function(e, val) {
        filter_functions[index] = function (x) {
            if (val.length === 0) return true;
            if (is_and) {
                for (var i = 0; i < val.length; i++) {
                    if (!x.includes(val[i])) return false;
                }
                return true;
            } else {
                for (var _i = 0; _i < val.length; _i++) {
                    if (x.includes(val[_i])) return true;
                }
                return false;
            }
        };
        filter_classes();
    }

    function switch_and_or(e, val) {
        is_and = val;
        ReactDOM.render(React.createElement(
            'div',
            null,
            is_and ? "and" : "or"
        ), document.getElementById(index.toString() + "toggle_label"));
        filter_classes();
    }

    return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
            'div',
            { className: 'col-10' },
            React.createElement(Autocomplete, {
                multiple: true,
                onChange: filter_function,
                options: options,
                getOptionLabel: function getOptionLabel(option) {
                    return option;
                },
                renderInput: function renderInput(params) {
                    return React.createElement(TextField, Object.assign({}, params, {
                        variant: 'standard',
                        label: label,
                        placeholder: label
                    }));
                }
            })
        ),
        React.createElement(
            'div',
            { className: 'col-2 text-center small p-0' },
            React.createElement(Switch, {
                color: 'primary',
                size: 'small',
                onChange: switch_and_or,
                defaultChecked: is_and
            }),
            React.createElement(
                'span',
                { id: index.toString() + "toggle_label", className: 'small' },
                is_and ? "and" : "or"
            )
        )
    );
}

export default function add_multi_select(label, key, is_and) {
    filter_keys.push(key);
    var index = filter_keys.length - 1;
    var attributes = Array.from(new Set(get_values(key).flat()));
    var input_element = AutocompleteMultiple(label, attributes, index, is_and);
    filter_elements.push(FilterElement(input_element, index));
}