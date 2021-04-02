import React from 'react';
import ReactDOM from 'react-dom';

function grade_color(grade) {
    var grade_color_dict = {
        "A": "success",
        "B": "primary",
        "C": "warning",
        "D": "danger",
        "F": "dark",
        "T": "secondary",
        "P": "secondary"
    };
    if (typeof grade == "string") return grade_color_dict[grade.charAt(0)];
    return "secondary";
}

function Class(class_dict, remove, rate) {
    var remove_icon = null;
    var rate_icon = null;

    function remove_self() {
        console.log("WHAAAAT");
        fetch("/remove_class", {
            method: "POST",
            body: JSON.stringify(class_dict)
        }).then(function (r) {
            return r.json();
        }).then(function (result) {
            return render_classes(result, true, false);
        }, function (error) {
            return console.log(error);
        });
    }

    function rate_self() {
        console.log("rate");
        fetch("/rate_class", {
            method: "POST",
            body: JSON.stringify(class_dict)
        }).then(function (r) {
            return r.json();
        }).then(function (result) {
            return ReactDOM.render(React.createElement(
                'div',
                { className: 'd-flex flex-wrap justify-content-center' },
                Class(result)
            ), document.getElementById("add_class_form"));
        }, function (error) {
            return console.log(error);
        });
    }

    if (remove) {
        remove_icon = React.createElement(
            'span',
            { className: 'float-end ms-2' },
            React.createElement(
                'a',
                { href: '#', className: 'stretched-link link-danger', onClick: remove_self },
                React.createElement('i', { className: 'bi bi-x-circle-fill' })
            )
        );
    }
    if (rate) {
        rate_icon = React.createElement(
            'span',
            { className: 'float-end ms-2' },
            React.createElement(
                'a',
                { href: '#', className: 'stretched-link link-success', onClick: rate_self },
                React.createElement('i', { className: 'bi bi-x-circle-fill' })
            )
        );
    }

    return React.createElement(
        'div',
        { className: 'card mb-2 bg-light class_card' },
        React.createElement(
            'div',
            { className: 'card-body py-1 px-3 row' },
            React.createElement(
                'div',
                { className: 'col-7 col-md-8 text-nowrap text-truncate' },
                React.createElement(
                    'span',
                    { className: 'badge bg-primary' },
                    class_dict["subj"],
                    ' ',
                    class_dict["crse"]
                ),
                React.createElement(
                    'span',
                    { className: 'fs-6' },
                    " ",
                    class_dict["title"]
                )
            ),
            React.createElement(
                'div',
                { className: 'col-5 col-md-4 my-auto' },
                remove_icon,
                rate_icon,
                React.createElement(
                    'span',
                    { className: 'float-end badge bg-dark ms-1' },
                    class_dict["cred"]
                ),
                React.createElement(
                    'span',
                    { className: "float-end badge ms-1 bg-" + grade_color(class_dict["grade"]) },
                    class_dict["grade"]
                )
            )
        )
    );
}

export default function render_classes(classes, remove, rate) {
    if (classes.length === 0) {
        ReactDOM.render(React.createElement(
            'div',
            { className: 'alert alert-secondary col-10 col-md-6 mx-auto', role: 'alert' },
            'You have not added any classes yet'
        ), document.getElementById("classes_container"));
        return;
    }

    function render_array(array) {
        var elements = array.map(function (class_dict, index) {
            return React.createElement(
                'div',
                { key: index, className: 'px-1 pb-1' },
                Class(class_dict, remove, rate)
            );
        }).reverse();
        ReactDOM.render(React.createElement(
            'div',
            { className: 'd-flex flex-wrap justify-content-center' },
            elements
        ), document.getElementById("classes_container"));
    }

    function render_slowly(i) {
        setTimeout(function () {
            render_array(my_courses.slice(0, i));
            if (i > my_courses.length) return;
            render_slowly(i + 1);
        }, 25);
    }

    var original_length = my_courses.length;
    my_courses = classes;
    render_slowly(original_length);
}
render_classes(my_courses);
import render_upload_form from "./upload_transcript";

ReactDOM.render(React.createElement(
    'a',
    { className: 'dropdown-item', href: '#', onClick: render_upload_form },
    'Upload Transcript'
), document.getElementById("upload_transcript_li"));
import render_add_class_form from "./add_class";

ReactDOM.render(React.createElement(
    'a',
    { className: 'dropdown-item', href: '#', onClick: render_add_class_form },
    'Add Manually'
), document.getElementById("add_class_li"));
import render_remove_form from "./remove_classes";

ReactDOM.render(React.createElement(
    'a',
    { className: 'dropdown-item', href: '#', onClick: render_remove_form },
    'Remove Classes'
), document.getElementById("remove_form_li"));

import render_rate_form from "./rate_class";
ReactDOM.render(React.createElement(
    'a',
    { className: 'dropdown-item', href: '#', onClick: render_rate_form },
    'Rate Classes'
), document.getElementById("rate_form_li"));