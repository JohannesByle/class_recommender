import React from 'react';
import ReactDOM from 'react-dom';
import {filter_keys, filter_functions, get_values} from "./index";
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import {IconButton, withStyles} from "@material-ui/core";
import AddIcon from '@material-ui/icons/AddCircle';
import MuiAccordion from '@material-ui/core/Accordion';
import {update_worksheet} from "./update_worksheet";
import {checkbox_vars} from "./index";
import {worksheet_classes} from "./update_worksheet";

const current_year = Math.max.apply(Math, get_values("term_float"));
const base_num_rows = 25;
let num_rows = base_num_rows;

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
        <span key={attribute} className="pill badge bg-secondary ms-1">{attribute}</span>
    );
    const offered_terms = class_dict["offered_terms_readable"].map((term, index) =>
        <span key={term} className={"pill badge bg-secondary" + (index === 0 ? "" : " ms-1")}>{term}</span>
    );
    let archived = null;
    let add_to_worksheet_button = null


    if (class_dict["term_float"] !== current_year) {
        archived = (
            <span className="badge bg-danger me-1">{class_dict["term"]}</span>
        );
    } else {
        add_to_worksheet_button = (

            <IconButton aria-label="delete"
                        size="small"
                        onClick={() => update_worksheet(class_dict)}

            >
                <AddIcon style={{color: "#FFFFFF"}}/>
            </IconButton>

        );
    }


    return (
        <div className="row">
            <div className="col my-auto p-0" style={{maxWidth: 24}}>
                {add_to_worksheet_button}
            </div>
            <div className="col">
                <div className="card mb-2 bg-light border-secondary border-2">
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <div className="card-body p-0 row">
                                <div className="col my-auto">
                                    <span className="fs-6">{archived}{class_dict["title"]}</span>
                                    <footer className="text-secondary fw-light">
                                <span className="badge bg-dark">
                                    {class_dict["subj"]} {class_dict["crse"]}
                                </span>
                                        <span className="badge bg-primary ms-1">{class_dict["cred"]}</span>
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
                            <div className="col">
                                <div className="row w-100">
                                    <div className="col-2">
                                        <div className="row">
                            <span>
                                <span className={"badge " + rem_color}>{class_dict["rem"]}</span>
                                {" "}Open Slot{class_dict["rem"] === 1 ? " " : "s "}
                            </span>
                                        </div>
                                        <div className="row">
                                            <span><span
                                                className="badge bg-primary">{class_dict["location"]}</span></span>
                                        </div>
                                        <div className="row">
                                            <span><span
                                                className="badge bg-dark">CRN</span>{" "}{class_dict["crn"]}</span>
                                        </div>
                                    </div>
                                    <div className="col text-secondary">
                                        {class_dict["desc"]}
                                    </div>
                                </div>
                                <div className="row">
                            <span>
                            {offered_terms}
                            </span>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}

function intersects(start1, start2, end1, end2) {
    if (start1 == null || start2 == null || end1 == null || end2 == null)
        return false
    return (start1 >= start2 && start1 <= end2) || (start2 >= start1 && start2 <= end1)
}

export default function filter_classes() {
    let filtered_classes_list = [];
    for (let i = 0; i < classes_list.length; i++) {
        let include_row = true;
        if (!checkbox_vars["show_archived"] && classes_list[i]["term_float"] !== current_year)
            continue
        if (checkbox_vars["hide_conflicts"]) {
            for (let course of worksheet_classes) {
                let same_day = false;
                for (let letter of course["days"]) {
                    if (classes_list[i]["days"] != null && classes_list[i]["days"].indexOf(letter) !== -1) {
                        same_day = true;
                        break;
                    }
                }
                if (!same_day)
                    continue;

                if (!intersects(course["start_date"], classes_list[i]["start_date"], course["end_date"], classes_list[i]["end_date"])) {
                    continue;
                }
                if (intersects(course["start_time"], classes_list[i]["start_time"], course["end_time"], classes_list[i]["end_time"])) {
                    include_row = false;
                    break;
                }
            }
        }
        for (let j = 0; j < filter_functions.length; j++) {
            if (!include_row)
                break;
            if (typeof filter_functions[j] === "function")
                include_row = filter_functions[j](classes_list[i][filter_keys[j]]);
        }
        if (include_row)
            filtered_classes_list.push(<div key={classes_list[i]["id"]}>{Class(classes_list[i])}</div>)
        if (filtered_classes_list.length >= num_rows)
            break;
    }

    function show_more() {
        num_rows += base_num_rows;
        filter_classes();
    }

    let num_classes_alert = null;
    if (filtered_classes_list.length >= num_rows) {
        num_classes_alert = (
            <div className="row mt-3">
                <div className="col">
                    <div className="alert alert-dark">Only showing first {num_rows} courses.</div>
                </div>
                <div className="col">
                    <button className="btn btn-secondary my-auto float-end" onClick={show_more}>Show more</button>
                </div>
            </div>

        );
    } else if (filtered_classes_list.length === 0) {
        num_classes_alert = (
            <div className="row">
                <div className="col">
                    <div className="alert alert-dark">No courses found</div>
                </div>
            </div>
        );
    }
    ReactDOM.render(
        <div>
            {filtered_classes_list}
            {num_classes_alert}
        </div>,
        document.getElementById("classes_container")
    );
}