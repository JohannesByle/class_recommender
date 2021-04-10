import React from 'react';
import ReactDOM from 'react-dom';
import {filter_keys, filter_functions} from "./index";
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import {withStyles} from "@material-ui/core";
import MuiAccordion from '@material-ui/core/Accordion';

const Accordion = withStyles({
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

function Class(class_dict) {
    const rem_color = class_dict["rem"] > 0 ? "bg-primary" : "bg-secondary";
    const attributes = class_dict["attributes"].map((attribute) =>
        <span key={attribute} className="pill badge bg-primary ms-1">{attribute}</span>
    );
    return (
        <div className="card mb-2 bg-light border-secondary border-2">
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <div className="card-body p-0 row">
                        <div className="col my-auto">
                            <span className="fs-6">{class_dict["title"]}</span>
                            <footer className="text-secondary fw-light">
                                <span className="badge bg-dark">
                                    {class_dict["subj"]} {class_dict["crse"]}
                                </span>
                                <span className="badge bg-secondary ms-1">{class_dict["cred"]}</span>
                                {attributes}
                                {" "}{class_dict["instructor"]}
                            </footer>

                        </div>
                        <div className="col my-auto">
                            <span className="float-end me-1">{class_dict["time"]}</span>
                            <span className="float-end badge bg-secondary me-1">{class_dict["days"]}</span>
                            <span className="float-end badge bg-primary me-1">{class_dict["quad"]}</span>
                        </div>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="row w-100">
                        <div className="col-2">
                            <div className="row">
                            <span>
                                <span className={"badge " + rem_color}>{class_dict["rem"]}</span>
                                {" "}Open Slot{class_dict["rem"] === 1 ? " " : "s "}
                            </span>
                            </div>
                            <div className="row">
                                <span><span className="badge bg-primary">{class_dict["location"]}</span></span>
                            </div>
                            <div className="row">
                                <span><span className="badge bg-dark">CRN</span>{" "}{class_dict["crn"]}</span>
                            </div>
                        </div>
                        <div className="col text-secondary">
                            {class_dict["desc"]}
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
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