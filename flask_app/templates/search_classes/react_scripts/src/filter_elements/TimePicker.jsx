import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardTimePicker} from '@material-ui/pickers';
import {filter_elements, filter_functions, filter_keys, FilterElement} from "../index";
import filter_classes from ".././filter_classes";


function TimePicker(props) {

    const [selectedDate, setSelectedDate] = React.useState(new Date("2000-01-01T" + props.time));
    const handleDateChange = (date) => {
        setSelectedDate(date);
        filter_functions[props.index] = (x) => {
            if (x == null)
                return true;
            if (props.before) {
                return date >= x;
            } else {
                return date <= x;
            }
        };

        filter_classes();
    };
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
                margin="normal"
                label={props.label}
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change time',
                }}
            />
        </MuiPickersUtilsProvider>
    );
}

export default function add_time_picker(label, key, default_time, before) {
    filter_keys.push(key);
    const index = filter_keys.length - 1;
    filter_elements.push(FilterElement(<TimePicker time={default_time} label={label} index={index}
                                                   before={before}/>, index));
}