import React from 'react';
import ReactDOM from 'react-dom';
import { filter_keys, filter_functions } from "./index";

function Class(class_dict) {
    var rem_color = class_dict["rem"] > 0 ? "bg-primary" : "bg-secondary";
    var attributes = class_dict["attributes"].map(function (attribute) {
        return React.createElement(
            'span',
            { key: attribute, className: 'pill badge bg-primary ms-1' },
            attribute
        );
    });
    return React.createElement(
        'div',
        { className: 'card mb-2 bg-light' },
        React.createElement(
            'div',
            { className: 'card-body py-1 px-3 row' },
            React.createElement(
                'div',
                { className: 'col my-auto' },
                React.createElement(
                    'span',
                    { className: 'fs-6' },
                    class_dict["title"]
                ),
                React.createElement(
                    'footer',
                    { className: 'text-secondary fw-light' },
                    React.createElement(
                        'span',
                        { className: 'badge bg-dark' },
                        class_dict["subj"],
                        ' ',
                        class_dict["crse"]
                    ),
                    attributes,
                    " ",
                    class_dict["instructor"]
                )
            ),
            React.createElement(
                'div',
                { className: 'col my-auto' },
                React.createElement(
                    'span',
                    { className: 'float-end badge bg-dark ms-1' },
                    class_dict["cred"]
                ),
                React.createElement(
                    'span',
                    { className: "float-end badge " + rem_color },
                    class_dict["rem"]
                ),
                React.createElement(
                    'span',
                    { className: 'float-end me-1' },
                    class_dict["time"]
                ),
                React.createElement(
                    'span',
                    { className: 'float-end badge bg-secondary me-1' },
                    class_dict["days"]
                )
            )
        )
    );
}

export default function filter_classes() {
    var num_rows = 50;
    var filtered_classes_list = [];
    for (var i = 0; i < classes_list.length; i++) {
        var include_row = true;
        for (var j = 0; j < filter_functions.length; j++) {
            if (typeof filter_functions[j] === "function") include_row = filter_functions[j](classes_list[i][filter_keys[j]]);
            if (!include_row) break;
        }
        if (include_row) filtered_classes_list.push(React.createElement(
            'div',
            { key: classes_list[i]["id"] },
            Class(classes_list[i])
        ));
        if (filtered_classes_list.length >= num_rows) break;
    }
    ReactDOM.render(React.createElement(
        'div',
        null,
        filtered_classes_list
    ), document.getElementById("classes_container"));
}