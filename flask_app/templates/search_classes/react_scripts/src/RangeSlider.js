import React from 'react';
import { Typography, Slider } from '@material-ui/core';
import { filter_elements, filter_functions, filter_keys, get_values, FilterElement } from "./index";
import filter_classes from "./filter_classes";

function RangeSlider(label, max, min, index) {
    function filter_function(e, val) {
        filter_functions[index] = function (x) {
            return isNaN(x) || x >= val[0] && x <= val[1];
        };
        filter_classes();
    }

    return React.createElement(
        'div',
        null,
        React.createElement(
            Typography,
            { id: 'range-slider', gutterBottom: true },
            React.createElement(
                'span',
                { className: 'fst-normal' },
                label
            )
        ),
        React.createElement(Slider, {
            defaultValue: [min, max],
            min: min,
            max: max,
            valueLabelDisplay: 'auto',
            onChange: filter_function
        })
    );
}

export default function add_slider(label, key, key_num) {
    filter_keys.push(key);
    var index = filter_keys.length - 1;
    var cred = get_values(key_num);
    var min = Math.min.apply(Math, cred);
    var max = Math.max.apply(Math, cred);
    filter_elements.push(FilterElement(RangeSlider(label, max, min, index), index));
}