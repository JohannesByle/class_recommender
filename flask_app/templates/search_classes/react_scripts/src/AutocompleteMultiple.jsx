import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {filter_elements, filter_functions, filter_keys, get_values, FilterElement} from "./index";
import filter_classes from "./filter_classes";


function AutocompleteMultiple(label, options, index) {
    function filter_function(e, val) {
        filter_functions[index] = (x) => {
            if (val.length === 0)
                return true;
            for (let i = 0; i < val.length; i++) {
                if (!x.includes(val[i]))
                    return false;
            }
            return true;
        };
        filter_classes();
    }

    return (
        <Autocomplete
            multiple
            onChange={filter_function}
            id="tags-standard"
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
        />
    );
}

export default function add_multi_select(label, key) {
    filter_keys.push(key);
    const index = filter_keys.length - 1;
    const attributes = Array.from(new Set(get_values(key).flat()));
    const input_element = AutocompleteMultiple(label, attributes, index);
    filter_elements.push(FilterElement(input_element, index));
}