import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

function ComboBox() {
    return React.createElement(Autocomplete, {
        id: "combo-box-demo",
        options: ["1", "2", "3"],
        renderInput: function renderInput(params) {
            return React.createElement(TextField, Object.assign({}, params, { label: "Combo box", variant: "standard" }));
        }
    });
}

function AddClassForm() {
    return React.createElement(
        "div",
        { className: "container mt-3 px-5 card bg-light border-secondary border-2",
            id: "add_class_form_container" },
        React.createElement(
            "div",
            { className: "col mt-3 mb-4", style: { maxWidth: 350 } },
            React.createElement(ComboBox, null)
        )
    );
}

export default function render_add_class_form() {
    ReactDOM.render(React.createElement(AddClassForm, null), document.getElementById("add_class_form"));
}