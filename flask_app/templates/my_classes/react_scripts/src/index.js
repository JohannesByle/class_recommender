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

function Class(class_dict) {
    return React.createElement(
        'div',
        { className: 'card mb-2 bg-light class_card' },
        React.createElement(
            'div',
            { className: 'card-body py-1 px-3 row' },
            React.createElement(
                'div',
                { className: 'col-8 text-nowrap text-truncate' },
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
                { className: 'col-4 my-auto' },
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

export default function render_classes(classes) {

    function render_array(array) {
        var elements = array.map(function (class_dict, index) {
            return React.createElement(
                'div',
                { key: index, className: 'px-1 pb-1' },
                Class(class_dict)
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
            if (i > my_courses.length) return;
            render_array(my_courses.slice(0, i));
            render_slowly(i + 1);
        }, 100);
    }

    render_array(my_courses);
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