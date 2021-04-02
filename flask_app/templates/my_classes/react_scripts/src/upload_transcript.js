import React from "react";
import ReactDOM from "react-dom";
import render_classes from "./index";

function UploadForm() {
    var file = null;

    function upload_transcript() {
        if (file === null) return;
        fetch("/upload_transcript", {
            method: "POST",
            body: file
        }).then(function (r) {
            return r.json();
        }).then(function (result) {
            ReactDOM.unmountComponentAtNode(document.getElementById("add_class_form"));
            render_classes(result, false, false);
        }, function (error) {
            return console.log(error);
        });
    }

    return React.createElement(
        "div",
        { style: { maxWidth: 350 }, className: "mt-3 mx-auto" },
        React.createElement(
            "div",
            { className: "mb-3" },
            React.createElement(
                "label",
                { htmlFor: "formFile", className: "form-label text-light" },
                "Upload transcript html file"
            ),
            React.createElement("input", { className: "form-control", type: "file", id: "formFile", accept: "text/html",
                onChange: function onChange(e) {
                    return file = e.target.files[0];
                } })
        ),
        React.createElement(
            "button",
            { className: "btn btn-secondary float-end", onClick: upload_transcript },
            "Upload"
        )
    );
}

export default function render_upload_form() {
    ReactDOM.render(React.createElement(UploadForm, null), document.getElementById("add_class_form"));
}