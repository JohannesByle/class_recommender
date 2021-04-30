function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

function render_schedule(schedule) {
  ReactDOM.render( /*#__PURE__*/React.createElement("div", null, schedule["unsatisfied"].map((val, index) => /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    key: index
  }, "Unsatisfied Requirement: ", val)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap"
  }, schedule["schedule"].map((val, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "card m-2",
    style: {
      "width": "500px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h5"
  }, "Semester ", index + 1, ":", " ")), /*#__PURE__*/React.createElement("div", {
    className: "card-text"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "list-group"
  }, val.map((val, index) => /*#__PURE__*/React.createElement("li", {
    className: "list-group-item",
    key: index
  }, /*#__PURE__*/React.createElement("span", {
    className: "pill badge bg-primary px-2"
  }, val["Disc"], " ", val["Num"]), " ", val["title"], " ", /*#__PURE__*/React.createElement("span", {
    className: "pill badge bg-secondary px-2"
  }, val["Credits"], " Credits")))))))))), document.getElementById("schedule_container"));
}

function ComboBox(label, options, custom_function) {
  return /*#__PURE__*/React.createElement(Autocomplete, {
    id: label,
    options: options,
    renderInput: params => /*#__PURE__*/React.createElement(TextField, _extends({}, params, {
      label: label,
      variant: "standard"
    })),
    onChange: custom_function,
    error: "true",
    defaultValue: null
  });
}

function SuggestedScheduleForm() {
  let major_name = null;

  function get_task_status(task_id) {
    fetch("/suggested_schedule_status_post", {
      method: "POST",
      body: task_id
    }).then(r => r.json()).then(result => {
      if ("schedule" in result) {
        render_schedule(result);
      } else {
        console.log(result);
      }

      if (!result["done"]) window.setTimeout(() => get_task_status(task_id), 500);
    }, error => console.log(error));
  }

  function start_task() {
    if (major_name == null) return;
    fetch("/suggested_schedule_post", {
      method: "POST",
      body: known_majors[major_name]
    }).then(r => r.json()).then(result => get_task_status(result), error => console.log(error));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "mx-auto",
    style: {
      maxWidth: 400
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mt-3 card bg-light border-secondary border-2",
    id: "add_class_form_container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col m-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2",
    id: "subject_input"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-2",
    id: "course_input"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-2",
    id: "grade_input"
  }, ComboBox("Major", Object.keys(known_majors), (e, val) => major_name = val)))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary float-end mt-3",
    onClick: start_task
  }, "Generate Suggested Schedule"));
}

ReactDOM.render( /*#__PURE__*/React.createElement(SuggestedScheduleForm, null), document.getElementById("options_form"));