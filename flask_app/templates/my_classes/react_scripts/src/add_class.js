import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

var subjects = Object.keys(courses_dict);

function ComboBox(label, options, custom_function) {
    return React.createElement(Autocomplete, {
        id: label,
        options: options,
        renderInput: function renderInput(params) {
            return React.createElement(TextField, Object.assign({}, params, { label: label, variant: "standard" }));
        },
        onChange: custom_function
    });
}

function AddClassForm() {
    function update_course_list(e, subject) {
        var codes = Object.keys(courses_dict[subject]);
        var courses = [];
        for (var i = 0; i < codes.length; i++) {
            courses.push(codes[i] + " " + courses_dict[subject][codes[i]]);
        }

        ReactDOM.render(ComboBox("Course", courses, function (e, val) {
            return null;
        }), document.getElementById("course_input"));
    }

    return React.createElement(
        "div",
        { className: "mx-auto", style: { maxWidth: 400 } },
        React.createElement(
            "div",
            { className: "container mt-3 card bg-light border-secondary border-2",
                id: "add_class_form_container" },
            React.createElement(
                "div",
                { className: "col m-3" },
                React.createElement(
                    "div",
                    { className: "mb-2", id: "subject_input" },
                    ComboBox("Subject", subjects, update_course_list)
                ),
                React.createElement("div", { className: "mb-2", id: "course_input" }),
                React.createElement(
                    "div",
                    { className: "mb-2", id: "grade_input" },
                    ComboBox("Grade", ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", "P"], function (e, val) {
                        return null;
                    })
                )
            )
        ),
        React.createElement(
            "button",
            { className: "btn btn-secondary float-end mt-3" },
            "Add Class"
        )
    );
}

export default function render_add_class_form() {
    ReactDOM.render(React.createElement(AddClassForm, null), document.getElementById("add_class_form"));
}