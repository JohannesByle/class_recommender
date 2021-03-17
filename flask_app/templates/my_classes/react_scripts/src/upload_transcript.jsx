import React from "react";
import ReactDOM from "react-dom";
import render_classes from "./index";

function UploadForm() {
    let file = null;

    function upload_transcript() {
        if (file === null)
            return
        fetch("/upload_transcript",
            {
                method: "POST",
                body: file
            }
        ).then(r => r.json()).then(
            (result) => {
                ReactDOM.unmountComponentAtNode(document.getElementById("add_class_form"))
                render_classes(result)
            },
            (error) => console.log(error));
    }

    return (
        <div style={{maxWidth: 350}} className="mt-3 mx-auto">
            <div className="mb-3">
                <label htmlFor="formFile" className="form-label text-light">Upload transcript html file</label>
                <input className="form-control" type="file" id="formFile" accept="text/html"
                       onChange={(e) => file = e.target.files[0]}/>
            </div>
            <button className="btn btn-secondary float-end" onClick={upload_transcript}>Upload
            </button>
        </div>
    );
}


export default function render_upload_form() {
    ReactDOM.render(
        <UploadForm/>,
        document.getElementById("add_class_form")
    );
}

