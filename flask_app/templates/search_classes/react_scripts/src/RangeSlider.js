import React from 'react';
import { Typography, Slider } from '@material-ui/core';

export default function RangeSlider(label, max, min, index, filter_functions, filter_classes) {
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