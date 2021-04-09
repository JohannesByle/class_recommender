import React from 'react';
import { Typography, Slider } from '@material-ui/core';
import { filter_elements, filter_functions, filter_keys, get_values, FilterElement } from "./index";
import filter_classes from "./filter_classes";

function RangeSlider(label, max, min, index) {
    function filter_function(e, val) {
        filter_functions[index] = function (x) {
            return isNaN(x[0]) || isNaN(x[1]) || x[1] >= val[0] && x[0] <= val[1];
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
            onChangeCommitted: filter_function
        })
    );
}

export default function add_slider(label, key) {
    filter_keys.push(key);
    var index = filter_keys.length - 1;
    var values = get_values(key);
    var min = Math.min.apply(Math, values.map(function (x) {
        return x[0];
    }));
    var max = Math.max.apply(Math, values.map(function (x) {
        return x[1];
    }));
    filter_elements.push(FilterElement(RangeSlider(label, max, min, index), index));
}