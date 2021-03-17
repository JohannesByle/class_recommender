import React from 'react';
import ReactDOM from 'react-dom';


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


function Class(class_dict) {
    return (
        <div className="card mb-2 bg-light class_card">
            <div className="card-body py-1 px-3 row">
                <div className="col-8 text-nowrap text-truncate">
                    <span className="badge bg-primary">{class_dict["subj"]} {class_dict["crse"]}</span>
                    <span className="fs-6">{" "}{class_dict["title"]}</span>
                </div>
                <div className="col-4 my-auto">
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

    function render_array(array) {
        const elements = array.map(
            (class_dict, index) =>
                <div key={index} className="px-1 pb-1">
                    {Class(class_dict)}
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
            if (i > my_courses.length)
                return
            render_array(my_courses.slice(0, i))
            render_slowly(i + 1)
        }, 100);
    }

    render_array(my_courses)
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