import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

function render_schedule(schedule) {
    console.log(schedule)
    ReactDOM.render(
        <div className="d-flex flex-wrap">{
            schedule.map((val, index) =>
                <div key={index} className="card m-2" style={{"width": "500px"}}>
                    <div className="card-body">
                        <div className="card-title">
                            <span className="h5">Semester {index + 1}:{" "}</span>
                            <span className="pill badge bg-secondary px-2">{val["credit_hours"]} Credit Hours</span>
                        </div>
                        <div className="card-text">
                            <ul className="list-group">
                                {val["courses"].map((val, index) =>
                                    <li className="list-group-item" key={index}>
                                        <span className="pill badge bg-primary px-2">{val["Disc"]} {val["Num"]}</span>
                                        {" "}{val["title"]}{" "}
                                        <span className="pill badge bg-secondary px-2">{val["Credits"]} Credits</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }</div>,
        document.getElementById("schedule_container")
    );
}

function ComboBox(label, options, custom_function) {
    return (
        <Autocomplete
            id={label}
            options={options}
            renderInput={(params) => <TextField {...params} label={label} variant="standard"/>}
            onChange={custom_function}
            error="true"
            defaultValue={null}
        />
    );
}

function SuggestedScheduleForm() {
    let major_name = null;

    function upload_class() {
        if (major_name == null)
            return
        fetch("/suggested_schedule_post",
            {
                method: "POST",
                body: known_majors[major_name]
            }
        ).then(r => r.json()).then(
            (result) => render_schedule(result),
            (error) => console.log(error));
    }

    return (
        <div className="mx-auto" style={{maxWidth: 400}}>
            <div className="container mt-3 card bg-light border-secondary border-2"
                 id="add_class_form_container">
                <div className="col m-3">
                    <div className="mb-2" id="subject_input">
                    </div>
                    <div className="mb-2" id="course_input">
                    </div>
                    <div className="mb-2" id="grade_input">
                        {ComboBox("Major", Object.keys(known_majors), (e, val) => major_name = val)}
                    </div>
                </div>
            </div>
            <button className="btn btn-secondary float-end mt-3" onClick={upload_class}>
                Generate Suggested Schedule
            </button>
        </div>

    );
}


ReactDOM.render(
    <SuggestedScheduleForm/>,
    document.getElementById("options_form")
);



