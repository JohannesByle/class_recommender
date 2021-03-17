import React from "react";
import ReactDOM from "react-dom";
import render_classes from "./index";

export default function render_remove_form() {
    function stop_removing() {
        ReactDOM.unmountComponentAtNode(document.getElementById("add_class_form"));
        render_classes(my_courses, false);
    }

    ReactDOM.render(React.createElement(
        "div",
        { className: "mx-auto mt-3 text-center" },
        React.createElement(
            "button",
            { className: "btn btn-secondary", onClick: stop_removing },
            "Stop Removing Classes"
        )
    ), document.getElementById("add_class_form"));
    render_classes(my_courses, true);
}