import React from 'react';
import { Typography, Slider } from '@material-ui/core';
import { filter_elements, filter_functions, filter_keys, get_values, FilterElement } from "../index";
import filter_classes from "../filter_classes";

function RangeSlider(label, max, min, index) {
  function filter_function(e, val) {
    filter_functions[index] = x => {
      return isNaN(x[0]) || isNaN(x[1]) || x[1] >= val[0] && x[0] <= val[1];
    };

    filter_classes();
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Typography, {
    id: "range-slider",
    gutterBottom: true
  }, /*#__PURE__*/React.createElement("span", {
    className: "fst-normal"
  }, label)), /*#__PURE__*/React.createElement(Slider, {
    defaultValue: [min, max],
    min: min,
    max: max,
    valueLabelDisplay: "auto",
    onChangeCommitted: filter_function
  }));
}

export default function add_slider(label, key) {
  filter_keys.push(key);
  const index = filter_keys.length - 1;
  const values = get_values(key);
  const min = Math.min.apply(Math, values.map(x => x[0]));
  const max = Math.max.apply(Math, values.map(x => x[1]));
  filter_elements.push(FilterElement(RangeSlider(label, max, min, index), index));
}