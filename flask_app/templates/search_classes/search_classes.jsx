const classes_list = {{ classes_list|safe }};

function Class(class_dict) {
    const rem_color = class_dict["rem"] > 0 ? "bg-primary" : "bg-secondary";
    return (
        <div className="card mb-2 bg-light" key={class_dict["id"]}>
            <div className="card-body py-1 px-3 row">
                <div className="col my-auto">
                    <span className="fs-6">{class_dict["title"]}</span>
                    <footer className="text-secondary fw-light">
                        <span className="badge bg-secondary">
                            {class_dict["subj"]} {class_dict["crse"]}
                        </span>
                        {" "}{class_dict["instructor"]}
                    </footer>
                </div>
                <div className="col my-auto">
                    <span className={"float-end badge " + rem_color}>{class_dict["rem"]}</span>
                </div>
            </div>
        </div>
    );
}

const classes_list_elements = classes_list.map((row) => Class(row));
ReactDOM.render(
    <div>{classes_list_elements}</div>,
    document.getElementById('root')
);