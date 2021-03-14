import React from 'react';
import {Typography, Slider} from '@material-ui/core';
import {filter_elements, filter_functions, filter_keys, get_values, FilterElement} from "./index";
import filter_classes from "./filter_classes";

function RangeSlider(label, max, min, index) {
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

export default function add_slider(label, key, key_num) {
    filter_keys.push(key);
    const index = filter_keys.length - 1;
    const cred = get_values(key_num);
    const min = Math.min.apply(Math, cred);
    const max = Math.max.apply(Math, cred);
    filter_elements.push(FilterElement(RangeSlider(label, max, min, index), index));
}