import {Button} from '@material-ui/core';


function Class(class_dict) {
    const rem_color = class_dict["rem"] > 0 ? "bg-primary" : "bg-secondary";
    const attributes = class_dict["attributes"].map((attribute) =>
        <span key={attribute} className="pill badge bg-primary ms-1">{attribute}</span>
    );
    return (
        <div className="card mb-2 bg-light">
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

const classes_list_elements = classes_list.map((row) => <div key={row["id"]}>{Class(row)}</div>);
ReactDOM.render(
    <div>{classes_list_elements}</div>,
    document.getElementById("classes_container")
);
