import React from 'react';
import {Typography, Slider} from '@material-ui/core';

export default function RangeSlider(label, max, min, index, filter_functions, filter_classes) {
    function filter_function(e, val) {
        filter_functions[index] = (x) => {
            return (isNaN(x)) || (x >= val[0]) && (x <= val[1]);
        };
        filter_classes();
    }

    return (
        <div>
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
    );
}