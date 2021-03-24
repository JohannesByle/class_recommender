import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

function render_schedule(schedule) {
    console.log(schedule);
    ReactDOM.render(React.createElement(
        "div",
        { className: "d-flex flex-wrap" },
        schedule.map(function (val, index) {
            return React.createElement(
                "div",
                { key: index, className: "card m-2", style: { "width": "500px" } },
                React.createElement(
                    "div",
                    { className: "card-body" },
                    React.createElement(
                        "div",
                        { className: "card-title" },
                        React.createElement(
                            "span",
                            { className: "h5" },
                            "Semester ",
                            index + 1,
                            ":",
                            " "
                        ),
                        React.createElement(
                            "span",
                            { className: "pill badge bg-secondary px-2" },
                            val["credit_hours"],
                            " Credit Hours"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "card-text" },
                        React.createElement(
                            "ul",
                            { className: "list-group" },
                            val["courses"].map(function (val, index) {
                                return React.createElement(
                                    "li",
                                    { className: "list-group-item", key: index },
                                    React.createElement(
                                        "span",
                                        { className: "pill badge bg-primary px-2" },
                                        val["Disc"],
                                        " ",
                                        val["Num"]
                                    ),
                                    " ",
                                    val["title"],
                                    " ",
                                    React.createElement(
                                        "span",
                                        { className: "pill badge bg-secondary px-2" },
                                        val["Credits"],
                                        " Credits"
                                    )
                                );
                            })
                        )
                    )
                )
            );
        })
    ), document.getElementById("schedule_container"));
}

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

function SuggestedScheduleForm() {
    var major_name = null;

    function upload_class() {
        if (major_name == null) return;
        fetch("/suggested_schedule_post", {
            method: "POST",
            body: known_majors[major_name]
        }).then(function (r) {
            return r.json();
        }).then(function (result) {
            return render_schedule(result);
        }, function (error) {
            return console.log(error);
        });
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
                React.createElement("div", { className: "mb-2", id: "subject_input" }),
                React.createElement("div", { className: "mb-2", id: "course_input" }),
                React.createElement(
                    "div",
                    { className: "mb-2", id: "grade_input" },
                    ComboBox("Major", Object.keys(known_majors), function (e, val) {
                        return major_name = val;
                    })
                )
            )
        ),
        React.createElement(
            "button",
            { className: "btn btn-secondary float-end mt-3", onClick: upload_class },
            "Generate Suggested Schedule"
        )
    );
}

ReactDOM.render(React.createElement(SuggestedScheduleForm, null), document.getElementById("options_form"));