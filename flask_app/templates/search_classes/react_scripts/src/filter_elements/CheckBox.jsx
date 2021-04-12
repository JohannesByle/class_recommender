import React from 'react';
import {Checkbox} from '@material-ui/core';
import filter_classes from "../filter_classes";
import {checkbox_vars} from "../index";

export function CustomCheckBox(key, label) {
    function change(e, val) {
        checkbox_vars[key] = val;
        filter_classes();
    }

    return (
        <div>
            <Checkbox
                name="showArchived"
                color="primary"
                onChange={change}
                defaultChecked={checkbox_vars[key]}
                size="small"
            />
            {label}
        </div>
    );
}
