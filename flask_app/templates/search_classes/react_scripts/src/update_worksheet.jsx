import React from "react";
import ReactDOM from "react-dom";
import filter_classes from "./filter_classes";

export let worksheet_classes = new Set();

export function update_worksheet(new_class) {
    function remove_class(course) {
        worksheet_classes.delete(course)
        update_worksheet()
        filter_classes()
    }

    function worksheet_class(class_dict) {
        return (
            <div className="row m-2" key={class_dict["id"]}>
            <span className="mx-0 px-0">
                <span className="badge bg-secondary">{class_dict["subj"]} {class_dict["crse"]}</span>
                <span className="text-secondary fw-light ms-1 overflow-hidden">{class_dict["crn"]}</span>
                <a href="#" className="stretched-link link-danger float-end" onClick={() => remove_class(class_dict)}>
                    <i className="bi bi-x-circle-fill"></i>
                </a>
            </span>
            </div>
        );

    }

    if (new_class != null) {
        worksheet_classes.add(new_class)
        filter_classes()
    }
    let classes_elements;
    if (worksheet_classes.size === 0) {
        classes_elements = <div className="badge pill rounded-pill my-2 bg-secondary">No courses in worksheet</div>
    } else {
        classes_elements = <div>{Array.from(worksheet_classes).map((class_dict) => worksheet_class(class_dict))}</div>
    }
    ReactDOM.render(classes_elements, document.getElementById("worksheet_container"))
}