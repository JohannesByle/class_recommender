import ReactDOM from "react-dom";
import render_classes from "./index";
import React from "react";

export default function render_rate_class_form() {
    function stop_rating() {
        ReactDOM.unmountComponentAtNode(document.getElementById("add_class_form"))
        render_classes(my_courses, false, false)
    }

    ReactDOM.render(
        <div className="mx-auto" style={{maxWidth: 400}}>
            <div className="mx-auto mt-3 text-center">
                <button className="btn btn-secondary" onClick={stop_rating}>Stop Rating Classes</button>
            </div>
        </div>,
        document.getElementById("add_class_form")
    );
    render_classes(my_courses, false, true)
}
