import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

function ComboBox() {
    return (
        <Autocomplete
            id="combo-box-demo"
            options={["1", "2", "3"]}
            renderInput={(params) => <TextField {...params} label="Combo box" variant="standard"/>}
        />
    );
}

function AddClassForm() {
    return (
        <div className="container mt-3 px-5 card bg-light border-secondary border-2"
             id="add_class_form_container">
            <div className="col mt-3 mb-4" style={{maxWidth: 350}}>
                <ComboBox/>
            </div>
        </div>

    );
}

export default function render_add_class_form() {
    ReactDOM.render(
        <AddClassForm/>,
        document.getElementById("add_class_form")
    );
}

