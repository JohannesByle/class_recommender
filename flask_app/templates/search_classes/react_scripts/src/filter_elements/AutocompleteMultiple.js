function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { filter_elements, filter_functions, filter_keys, get_values, FilterElement } from "../index";
import filter_classes from "../filter_classes";
import { Switch } from "@material-ui/core";
import ReactDOM from "react-dom";

function AutocompleteMultiple(label, options, index, is_and) {
  function filter_function(e, val) {
    filter_functions[index] = x => {
      if (val.length === 0) return true;

      if (is_and) {
        for (let i = 0; i < val.length; i++) {
          if (!x.includes(val[i])) return false;
        }

        return true;
      } else {
        for (let i = 0; i < val.length; i++) {
          if (x.includes(val[i])) return true;
        }

        return false;
      }
    };

    filter_classes();
  }

  function switch_and_or(e, val) {
    is_and = val;
    ReactDOM.render( /*#__PURE__*/React.createElement("div", null, is_and ? "and" : "or"), document.getElementById(index.toString() + "toggle_label"));
    filter_classes();
  }

  let and_or_switch = null;

  if (is_and != null) {
    and_or_switch = /*#__PURE__*/React.createElement("div", {
      className: "col-2 text-center small p-0"
    }, /*#__PURE__*/React.createElement(Switch, {
      color: "primary",
      size: "small",
      onChange: switch_and_or,
      defaultChecked: is_and
    }), /*#__PURE__*/React.createElement("span", {
      id: index.toString() + "toggle_label",
      className: "small"
    }, is_and ? "and" : "or"));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement(Autocomplete, {
    multiple: true,
    onChange: filter_function,
    options: options,
    getOptionLabel: option => option,
    renderInput: params => /*#__PURE__*/React.createElement(TextField, _extends({}, params, {
      variant: "standard",
      label: label,
      placeholder: label
    })),
    style: {
      maxWidth: is_and == null ? null : 169
    }
  })), and_or_switch);
}

export default function add_multi_select(label, key, is_and) {
  filter_keys.push(key);
  const index = filter_keys.length - 1;
  const attributes = Array.from(new Set(get_values(key).flat()));
  const input_element = AutocompleteMultiple(label, attributes, index, is_and);
  filter_elements.push(FilterElement(input_element, index));
}