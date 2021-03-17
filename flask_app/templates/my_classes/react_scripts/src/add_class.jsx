import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

const subjects = Object.keys(courses_dict)

function ComboBox(label, options, custom_function) {
    return (
        <Autocomplete
            id={label}
            options={options}
            renderInput={(params) => <TextField {...params} label={label} variant="standard"/>}
            onChange={custom_function}
        />
    );
}


function AddClassForm() {
    function update_course_list(e, subject) {
        const codes = Object.keys(courses_dict[subject]);
        const courses = []
        for (let i = 0; i < codes.length; i++) {
            courses.push(codes[i] + " " + courses_dict[subject][codes[i]])
        }

        ReactDOM.render(
            ComboBox("Course", courses, (e, val) => null),
            document.getElementById("course_input")
        );

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
                        {ComboBox("Grade", ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", "P"], (e, val) => null)}
                    </div>
                </div>
            </div>
            <button className="btn btn-secondary float-end mt-3">Add Class</button>
        </div>

    );
}

export default function render_add_class_form() {
    ReactDOM.render(
        <AddClassForm/>,
        document.getElementById("add_class_form")
    );
}

