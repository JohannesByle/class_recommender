import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import render_classes from "./index";

const subjects = Object.keys(courses_dict)

function ComboBox(label, options, custom_function) {
    return (
        <Autocomplete
            id={label}
            options={options}
            renderInput={(params) => <TextField {...params} label={label} variant="standard"/>}
            onChange={custom_function}
            error="true"
            defaultValue={null}
        />
    );
}


function AddClassForm() {
    let subject = null;
    let course = null;
    let title = null;
    let grade = null;
    let cred = null;

    function upload_class() {
        if (subject == null || course == null || grade == null)
            return
        fetch("/add_class",
            {
                method: "POST",
                body: JSON.stringify({"subj": subject, "crse": course, "grade": grade, "title": title, "cred": cred})
            }
        ).then(r => r.json()).then(
            (result) => render_classes(result, false, false),
            (error) => console.log(error));
    }

    function update_course_list(e, subj) {
        const codes = Object.keys(courses_dict[subj]);
        const courses = []
        for (let i = 0; i < codes.length; i++) {
            courses.push(codes[i] + " " + courses_dict[subj][codes[i]]["title"])
        }
        ReactDOM.unmountComponentAtNode(document.getElementById("course_input"))
        course = null;
        ReactDOM.render(
            ComboBox("Course", courses, (e, val) => {
                course = codes[courses.indexOf(val)]
                title = courses_dict[subj][course]["title"]
                cred = courses_dict[subj][course]["cred"]
            }),
            document.getElementById("course_input")
        );
        subject = subj;
    }

    return (
        <div className="mx-auto" style={{maxWidth: 400}}>
            <div className="container mt-3 card bg-light border-secondary border-2"
                 id="add_class_form_container">
                <div className="col m-3">
                    <div className="mb-2" id="subject_input">
                        {ComboBox("Subject", subjects, update_course_list)}
                    </div>
                    <div className="mb-2" id="course_input">
                    </div>
                    <div className="mb-2" id="grade_input">
                        {ComboBox("Grade", ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", "P"], (e, val) => grade = val)}
                    </div>
                </div>
            </div>
            <button className="btn btn-secondary float-end mt-3" onClick={upload_class}>Add Class</button>
        </div>

    );
}

export default function render_add_class_form() {
    ReactDOM.render(
        <AddClassForm/>,
        document.getElementById("add_class_form")
    );
}

