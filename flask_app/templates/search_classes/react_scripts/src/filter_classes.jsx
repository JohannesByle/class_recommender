import React from 'react';
import ReactDOM from 'react-dom';
import {filter_keys, filter_functions} from "./index";

function Class(class_dict) {
    const rem_color = class_dict["rem"] > 0 ? "bg-primary" : "bg-secondary";
    const attributes = class_dict["attributes"].map((attribute) =>
        <span key={attribute} className="pill badge bg-primary ms-1">{attribute}</span>
    );
    return (
        <div className="card mb-2 bg-light border-secondary border-2">
            <div className="card-body py-1 px-3 row">
                <div className="col my-auto">
                    <span className="fs-6">{class_dict["title"]}</span>
                    <footer className="text-secondary fw-light">
                        <span className="badge bg-dark">
                            {class_dict["subj"]} {class_dict["crse"]}
                        </span>
                        {attributes}
                        {" "}{class_dict["instructor"]}
                    </footer>

                </div>
                <div className="col my-auto">
                    <span className="float-end badge bg-dark ms-1">{class_dict["cred"]}</span>
                    <span className={"float-end badge " + rem_color}>{class_dict["rem"]}</span>
                    <span className="float-end me-1">{class_dict["time"]}</span>
                    <span className="float-end badge bg-secondary me-1">{class_dict["days"]}</span>
                </div>
            </div>
        </div>
    );
}

export default function filter_classes() {
    let num_rows = 50;
    let filtered_classes_list = [];
    for (let i = 0; i < classes_list.length; i++) {
        let include_row = true;
        for (let j = 0; j < filter_functions.length; j++) {
            if (typeof filter_functions[j] === "function")
                include_row = filter_functions[j](classes_list[i][filter_keys[j]]);
            if (!include_row)
                break;
        }
        if (include_row)
            filtered_classes_list.push(<div key={classes_list[i]["id"]}>{Class(classes_list[i])}</div>)
        if (filtered_classes_list.length >= num_rows)
            break;
    }
    ReactDOM.render(
        <div>{filtered_classes_list}</div>,
        document.getElementById("classes_container")
    );
}