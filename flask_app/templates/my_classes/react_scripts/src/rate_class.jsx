import ReactDOM from "react-dom";
import render_classes from "./index";
import React from "react";
import {ComboBox} from "./add_class";

export function RateClassForm(course) {

    console.log(course)

    let rating = null

    function add_rating() {
        if(rating == null)
            return

        course["rating"] = rating
        fetch("/rate_class",
            {
                method: "POST",
                body: JSON.stringify(course)
            }
        ).then(r => r.json()).then(
            (result) => render_classes(result, false, true),
            (error) => console.log(error));
    }

    ReactDOM.render(
        <div className="mx-auto" style={{maxWidth: 400}}>
            <div className="container mt-3 card bg-light border-secondary border-2"
                 id="rate_class_form_container">
                <div className="col m-3">
                    <div className="mb-2" id="_input">
                        {course["title"]}
                    </div>
                    <div className="mb-2" id="grade_input">
                        {ComboBox("Rating", ["1", "2", "3", "4", "5"], (e, val) => rating = val)}
                    </div>
                </div>
            </div>
            <button className="btn btn-secondary float-end mt-3" onClick={add_rating}>Add Rating</button>
        </div>, document.getElementById("add_class_form")

    );
}



export default function render_rate_class_form() {
    render_classes(my_courses, false, true)
}
