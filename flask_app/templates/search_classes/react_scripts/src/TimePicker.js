var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import { filter_elements, filter_functions, filter_keys, FilterElement, get_values } from "./index";
import filter_classes from "./filter_classes";

function TimePicker(props) {
    var _React$useState = React.useState(new Date("2014-08-18T" + props.time)),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        selectedDate = _React$useState2[0],
        setSelectedDate = _React$useState2[1];

    var handleDateChange = function handleDateChange(date) {
        setSelectedDate(date);
        filter_functions[props.index] = function (x) {
            if (x == null) return true;
            var time = new Date("2014-08-18T" + x + ":00");
            if (props.before) {
                return date >= time;
            } else {
                return date <= time;
            }
        };

        filter_classes();
    };
    return React.createElement(
        MuiPickersUtilsProvider,
        { utils: DateFnsUtils },
        React.createElement(KeyboardTimePicker, {
            margin: 'normal',
            label: props.label,
            value: selectedDate,
            onChange: handleDateChange,
            KeyboardButtonProps: {
                'aria-label': 'change time'
            }
        })
    );
}

export default function add_time_picker(label, key, default_time, before) {
    filter_keys.push(key);
    var index = filter_keys.length - 1;
    filter_elements.push(FilterElement(React.createElement(TimePicker, { time: default_time, label: label, index: index,
        before: before }), index));
}