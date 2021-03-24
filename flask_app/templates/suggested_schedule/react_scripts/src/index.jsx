import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

function render_schedule(schedule) {

    ReactDOM.render(
        <div>{
            schedule.map((val, index) =>
                <div key={index} className="card m-2">
                    <div className="card-body">
                        <div className="card-title h3">
                            Semester {index + 1}
                        </div>
                        <div className="card-text d-flex flex-wrap">
                            {val["courses"].map((val, index) =>
                                <span className="rounded-pill bg-secondary p-1 px-3 m-2"
                                      key={index}>{val[0]}, {val[1]}</span>
                            )}
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



