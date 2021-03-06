import {Typography, Slider} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from "./theme.js";
import React from 'react';

export default function RangeSlider(label, max, min, index, filter_functions, filter_classes) {
    function filter_function(e, val) {
        filter_functions[index] = (x) => {
            return (x >= val[0]) && (x <= val[1]);
        };
        filter_classes();
    }

    return (
        <div key={index}>
            <ThemeProvider theme={theme}>
                <div className="m-2 mt-3 border-bottom">
                    <Typography id="range-slider" gutterBottom>
                        <span className="fst-normal">{label}</span>
                    </Typography>
                    <Slider
                        defaultValue={[min, max]}
                        min={min}
                        max={max}
                        valueLabelDisplay="auto"
                        onChange={filter_function}
                    />
                </div>
            </ThemeProvider>
        </div>
    );
}