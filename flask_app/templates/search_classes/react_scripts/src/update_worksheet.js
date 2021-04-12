import React from "react";
import ReactDOM from "react-dom";
export let worksheet_classes = new Set();
export function update_worksheet(new_class) {
  function remove_class(course) {
    worksheet_classes.delete(course);
    update_worksheet();
  }

  function worksheet_class(class_dict) {
    return /*#__PURE__*/React.createElement("div", {
      className: "row m-2",
      key: class_dict["id"]
    }, /*#__PURE__*/React.createElement("span", {
      className: "mx-0 px-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge bg-secondary"
    }, class_dict["subj"], " ", class_dict["crse"]), /*#__PURE__*/React.createElement("span", {
      className: "text-secondary fw-light ms-1 overflow-hidden"
    }, class_dict["crn"]), /*#__PURE__*/React.createElement("a", {
      href: "#",
      className: "stretched-link link-danger float-end",
      onClick: () => remove_class(class_dict)
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-x-circle-fill"
    }))));
  }

  if (new_class != null) {
    worksheet_classes.add(new_class);
  }

  let classes_elements;

  if (worksheet_classes.size === 0) {
    classes_elements = /*#__PURE__*/React.createElement("div", {
      className: "badge pill rounded-pill my-2 bg-secondary"
    }, "No courses in worksheet");
  } else {
    classes_elements = /*#__PURE__*/React.createElement("div", null, Array.from(worksheet_classes).map(class_dict => worksheet_class(class_dict)));
  }

  ReactDOM.render(classes_elements, document.getElementById("worksheet_container"));
}