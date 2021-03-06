import { Typography, Slider } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./theme.js";
import React from 'react';

export default function RangeSlider(label, max, min, index, filter_functions, filter_classes) {
    function filter_function(e, val) {
        filter_functions[index] = function (x) {
            return x >= val[0] && x <= val[1];
        };
        filter_classes();
    }

    return React.createElement(
        'div',
        { key: index },
        React.createElement(
            ThemeProvider,
            { theme: theme },
            React.createElement(
                'div',
                { className: 'm-2 mt-3 border-bottom' },
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
            )
        )
    );
}