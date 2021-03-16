import React from 'react';
import ReactDOM from 'react-dom';


function grade_color(grade) {
    const grade_color_dict = {
        "A": "success",
        "B": "primary",
        "C": "warning",
        "D": "danger",
        "T": "secondary",
        "P": "secondary"
    }
    if (typeof grade == "string")
        return grade_color_dict[grade.charAt(0)]
    return "secondary"
}


function Class(class_dict) {
    return (
        <div className="card mb-2 bg-light" style={{width: 400}}>
            <div className="card-body py-1 px-3 row">
                <div className="col-9 text-nowrap text-truncate">
                    <span className="badge bg-primary">{class_dict["subj"]} {class_dict["crse"]}</span>
                    <span className="fs-6">{" "}{class_dict["title"]}</span>
                </div>
                <div className="col-3 my-auto">
                    <span className="float-end badge bg-dark ms-1">{class_dict["cred"]}</span>
                    <span className={"float-end badge ms-1 bg-" + grade_color(class_dict["grade"])}>
                        {class_dict["grade"]}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function render_classes(classes) {
    const classes_elements = classes.map((class_dict, index) =>
        <div key={index} className="px-1 pb-1">
            {Class(class_dict)}
        </div>)
    let i = 0

    function render_all() {
        setTimeout(function () {
            if (i > classes_elements.length)
                return
            ReactDOM.render(
                <div className="d-flex flex-wrap justify-content-center">{classes_elements.slice(0, i)}</div>,
                document.getElementById("classes_container")
            );
            i++;
            render_all()
        }, 50);
    }

    render_all()

}

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