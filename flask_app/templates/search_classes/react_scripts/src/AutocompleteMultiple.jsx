import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


export default function AutocompleteMultiple(label, options, index, filter_functions, filter_classes) {
    function filter_function(e, val) {
        filter_functions[index] = (x) => {
            if (val.length === 0)
                return true;
            for (let i = 0; i < val.length; i++) {
                if (x.includes(val[i]))
                    return true;
            }
            return false;
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