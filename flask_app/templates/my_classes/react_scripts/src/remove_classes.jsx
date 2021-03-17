import React from "react";
import ReactDOM from "react-dom";
import render_classes from "./index";

export default function render_remove_form() {
    ReactDOM.render(
        <div className="mx-auto mt-3 text-center">
            <button className="btn btn-secondary">Stop Removing Classes</button>
        </div>,
        document.getElementById("add_class_form")
    );
    render_classes(my_courses, true)
}