import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import render_classes from "./index";

var subjects = Object.keys(courses_dict);

function ComboBox(label, options, custom_function) {
    return React.createElement(Autocomplete, {
        id: label,
        options: options,
        renderInput: function renderInput(params) {
            return React.createElement(TextField, Object.assign({}, params, { label: label, variant: "standard" }));
        },
        onChange: custom_function,
        error: "true",
        defaultValue: null
    });
}

function AddClassForm() {
    var subject = null;
    var course = null;
    var title = null;
    var grade = null;
    var cred = null;

    function upload_class() {
        fetch("/add_class", {
            method: "POST",
            body: JSON.stringify({ "subj": subject, "crse": course, "grade": grade, "title": title, "cred": cred })
        }).then(function (r) {
            return r.json();
        }).then(function (result) {
            return render_classes(result);
        }, function (error) {
            return console.log(error);
        });
    }

    function update_course_list(e, subj) {
        var codes = Object.keys(courses_dict[subj]);
        var courses = [];
        for (var i = 0; i < codes.length; i++) {
            courses.push(codes[i] + " " + courses_dict[subj][codes[i]]["title"]);
        }
        ReactDOM.unmountComponentAtNode(document.getElementById("course_input"));
        ReactDOM.render(ComboBox("Course", courses, function (e, val) {
            course = codes[courses.indexOf(val)];
            title = courses_dict[subj][course]["title"];
            cred = courses_dict[subj][course]["cred"];
        }), document.getElementById("course_input"));
        subject = subj;
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
                        return grade = val;
                    })
                )
            )
        ),
        React.createElement(
            "button",
            { className: "btn btn-secondary float-end mt-3", onClick: upload_class },
            "Add Class"
        )
    );
}

export default function render_add_class_form() {
    ReactDOM.render(React.createElement(AddClassForm, null), document.getElementById("add_class_form"));
}