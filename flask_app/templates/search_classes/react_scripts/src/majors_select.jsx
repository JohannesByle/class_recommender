import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import React from "react";
import ReactDOM from "react-dom";
import {FilterElement} from "./index";
import filter_classes from "./filter_classes";

export let req = null;

export default function MajorsAutocomplete() {
    const label = "Major"
    let reqs_dict = null;

    function update_req(e, val) {
        req = val
        filter_classes();
    }

    function get_reqs(e, major) {
        let reqs = null;
        let label = "Requirement";
        fetch("/search_classes/get_reqs/" + majors_list[major])
            .then(r => r.json())
            .then((result) => {
                    reqs_dict = result;
                    reqs = new Set()
                    for (let major of Object.keys(reqs_dict)) {
                        for (let num of Object.keys(reqs_dict[major])) {
                            for (let req of reqs_dict[major][num])
                                reqs.add(req)
                        }

                    }
                    for (let i = 0; i < classes_list.length; i++) {
                        if (classes_list[i]["subj"] in reqs_dict) {
                            if (classes_list[i]["crse"] in reqs_dict[classes_list[i]["subj"]]) {
                                classes_list[i]["reqs"] = reqs_dict[classes_list[i]["subj"]][classes_list[i]["crse"]]
                            }
                        }
                    }
                    reqs = Array.from(reqs)
                    reqs.sort()
                    ReactDOM.render(
                        FilterElement(
                            <Autocomplete
                                multiple
                                onChange={update_req}
                                options={reqs}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={label}
                                        placeholder={label}
                                    />
                                )}
                            />
                        ),
                        document.getElementById("major_filters_container")
                    )
                    filter_classes()
                },
                (error) => console.log(error));

    }

    let options = Object.keys(majors_list)
    options.sort()
    return (
        <Autocomplete
            onChange={get_reqs}
            options={options}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label={label}
                    placeholder={label}
                />
            )}
        />
    );
}