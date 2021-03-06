import React from 'react';
import ReactDOM from 'react-dom';
import {Rating} from "@material-ui/lab"

function grade_color(grade) {
    const grade_color_dict = {
        "A": "success",
        "B": "primary",
        "C": "warning",
        "D": "danger",
        "F": "dark",
        "T": "secondary",
        "P": "secondary"
    }
    if (typeof grade == "string")
        return grade_color_dict[grade.charAt(0)]
    return "secondary"
}


function Class(class_dict, remove, rate) {
    let remove_icon = null;
    let rate_icon = null;

    function remove_self() {
        fetch("/remove_class",
            {
                method: "POST",
                body: JSON.stringify(class_dict)
            }
        ).then(r => r.json()).then(
            (result) => render_classes(result, true, false),
            (error) => console.log(error));
    }

    function add_rating(e, rating) {
        if (rating == null)
            return

        class_dict["rating"] = rating
        fetch("/rate_class",
            {
                method: "POST",
                body: JSON.stringify(class_dict)
            }
        ).then(r => r.json()).then(
            (result) => render_classes(result, false, true),
            (error) => console.log(error));
    }


    let normal_icons = (
        <div>
            <span className="float-end badge bg-dark ms-1">{class_dict["cred"]}</span>
            <span className={"float-end badge ms-1 bg-" + grade_color(class_dict["grade"])}>{class_dict["grade"]}</span>
        </div>
    );

    if (remove) {
        remove_icon = (
            <span className="float-end ms-2">
                <a href="#" className="stretched-link link-danger" onClick={remove_self}>
                    <i className="bi bi-x-circle-fill"></i>
                </a>
            </span>
        );
    }


    if (rate) {
        rate_icon = (
            <span className="float-end ms-1">
                    <Rating name={class_dict["title"]}
                            value={parseInt(class_dict["rating"]) || 0}
                            size="small"
                            onChange={add_rating}/>
            </span>
        );
        normal_icons = null;

    }

    return (
        <div className="card mb-2 bg-light class_card">
            <div className="card-body py-1 px-3 row">
                <div className="col-7 col-md-8 text-nowrap text-truncate">
                    <span className="badge bg-primary">{class_dict["subj"]} {class_dict["crse"]}</span>
                    <span className="fs-6">{" "}{class_dict["title"]}</span>
                </div>
                <div className="col-5 col-md-4 my-auto">
                    {rate_icon}
                    {remove_icon}
                    {normal_icons}
                </div>
            </div>
        </div>
    );
}

export default function render_classes(classes, remove, rate) {
    if (classes.length === 0) {
        ReactDOM.render(
            <div className="alert alert-secondary col-10 col-md-6 mx-auto" role="alert">
                You have not added any classes yet
            </div>,
            document.getElementById("classes_container")
        );
        return
    }

    function render_array(array) {
        const elements = array.map(
            (class_dict, index) =>
                <div key={index} className="px-1 pb-1">
                    {Class(class_dict, remove, rate)}
                </div>
        ).reverse();
        ReactDOM.render(
            <div className="d-flex flex-wrap justify-content-center">
                {elements}
            </div>,
            document.getElementById("classes_container")
        );
    }

    function render_slowly(i) {
        setTimeout(function () {
            render_array(my_courses.slice(0, i))
            if (i > my_courses.length)
                return
            render_slowly(i + 1)
        }, 25);
    }

    let original_length = my_courses.length
    my_courses = classes;
    render_slowly(original_length)

}
render_classes(my_courses);
import render_upload_form from "./upload_transcript";

ReactDOM.render(
    <a className="dropdown-item" href="#" onClick={render_upload_form}>Upload Transcript</a>,
    document.getElementById("upload_transcript_li")
)
import render_add_class_form from "./add_class";

ReactDOM.render(
    <a className="dropdown-item" href="#" onClick={render_add_class_form}>Add Manually</a>,
    document.getElementById("add_class_li")
)
import render_remove_form from "./remove_classes";

ReactDOM.render(
    <a className="dropdown-item" href="#" onClick={render_remove_form}>Remove Classes</a>,
    document.getElementById("remove_form_li")
)

import render_rate_class_form from "./rate_class";

ReactDOM.render(
    <a className="dropdown-item" href="#" onClick={render_rate_class_form}>Rate Classes</a>,
    document.getElementById("rate_form_li")
)
