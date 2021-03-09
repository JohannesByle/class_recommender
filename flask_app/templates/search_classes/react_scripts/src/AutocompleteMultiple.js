import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export default function AutocompleteMultiple(label, options, index, filter_functions, filter_classes) {
    function filter_function(e, val) {
        filter_functions[index] = function (x) {
            if (val.length === 0) return true;
            for (var i = 0; i < val.length; i++) {
                if (x.includes(val[i])) return true;
            }
            return false;
        };
        filter_classes();
    }

    return React.createElement(Autocomplete, {
        multiple: true,
        onChange: filter_function,
        id: 'tags-standard',
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
    });
}