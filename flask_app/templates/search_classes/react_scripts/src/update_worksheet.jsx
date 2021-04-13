import React from "react";
import ReactDOM from "react-dom";
import filter_classes from "./filter_classes";
import {classes_intersect} from "./utils";

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
                <a href="#" className="link-danger float-end" onClick={() => remove_class(class_dict)}>
                    <i className="bi bi-x-circle-fill"></i>
                </a>
            </span>
            </div>
        );

    }

    if (new_class != null) {
        let alert = null;
        if (worksheet_classes.has(new_class)) {
            alert = "Worksheet already contains " + new_class["subj"] + " " + new_class["crse"] + " " + new_class["crn"]
        } else {
            for (let course of worksheet_classes) {
                if (classes_intersect(course, new_class)) {
                    alert = new_class["subj"] + " " + new_class["crse"] + " conflicts with " + course["subj"] + " " + course["crse"]
                    break;
                }
            }
        }

        if (alert != null) {
            ReactDOM.render(
                <div className="alert alert-danger mb-4">
                    {alert}
                </div>,
                document.getElementById("worksheet_alert"))
        } else {
            worksheet_classes.add(new_class)
            filter_classes()
        }
    }
    let classes_elements;
    if (worksheet_classes.size === 0) {
        classes_elements = <div className="badge pill rounded-pill my-2 bg-secondary">No courses in worksheet</div>
    } else {
        classes_elements = <div>{Array.from(worksheet_classes).map((class_dict) => worksheet_class(class_dict))}</div>
    }
    ReactDOM.render(classes_elements, document.getElementById("worksheet_container"))
}