import ReactDOM from "react-dom";
import render_classes from "./index";
import React from "react";
import ComboBox from "./add_class";



export default function render_rate_form() {
    const ratings = ["1", "2", "3", "4", "5"]
    function stop_rating() {
        ReactDOM.unmountComponentAtNode(document.getElementById("add_class_form"))
        render_classes(my_courses, false, false)
    }

    ReactDOM.render(
            <div className="mx-auto mt-3 text-center">
                <button className="btn btn-secondary" onClick={stop_rating}>Stop Rating Classes</button>
            </div>,
        document.getElementById("add_class_form")
    );
    render_classes(my_courses, false, true)
}
