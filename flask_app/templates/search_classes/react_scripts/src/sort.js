function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import React from "react";
import filter_classes from "./filter_classes";
export let sort_functions = {
  "# of Major Requirements": function (a, b) {
    let reqs_a = [];
    let reqs_b = [];
    if ("reqs" in a) reqs_a = a.reqs;
    if ("reqs" in b) reqs_b = b.reqs;
    return reqs_a.length > reqs_b.length ? -1 : 1;
  },
  "Title": (a, b) => a.title > b.title ? 1 : -1,
  "Credits (ascending)": (a, b) => a.cred > b.cred ? 1 : -1,
  "Credits (descending)": (a, b) => a.cred > b.cred ? -1 : 1,
  "Open slots (ascending)": (a, b) => a.rem_num[0] > b.rem_num[0] ? 1 : -1,
  "Open slots (descending)": (a, b) => a.rem_num[0] > b.rem_num[0] ? -1 : 1,
  "Start time (ascending)": (a, b) => a.start_time > b.start_time ? 1 : -1,
  "Start time (descending)": (a, b) => a.start_time > b.start_time ? -1 : 1
};
export let sort_function = null;
export function SortSelect() {
  const label = "Sort by";

  function update_sort(e, val) {
    sort_function = val;
    filter_classes();
  }

  return /*#__PURE__*/React.createElement(Autocomplete, {
    onChange: update_sort,
    options: Object.keys(sort_functions),
    getOptionLabel: option => option,
    renderInput: params => /*#__PURE__*/React.createElement(TextField, _extends({}, params, {
      variant: "standard",
      label: label,
      placeholder: label
    }))
  });
}