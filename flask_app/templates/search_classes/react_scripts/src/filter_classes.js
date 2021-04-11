import React from 'react';
import ReactDOM from 'react-dom';
import { filter_keys, filter_functions, get_values } from "./index";
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { Checkbox, IconButton, withStyles } from "@material-ui/core";
import AddIcon from '@material-ui/icons/AddCircle';
import MuiAccordion from '@material-ui/core/Accordion';

var current_year = Math.max.apply(Math, get_values("term_float"));
var show_archived = false;
var base_num_rows = 25;
var num_rows = base_num_rows;
var worksheet_classes = [];
var hide_conflicts = false;

function update_worksheet(new_class) {
    function remove_class(course) {
        var index = worksheet_classes.indexOf(course);
        if (index > -1) {
            worksheet_classes.splice(index, 1);
        }
        update_worksheet();
    }

    function worksheet_class(class_dict) {
        return React.createElement(
            'div',
            { className: 'row m-2', key: class_dict["id"] },
            React.createElement(
                'span',
                { className: 'mx-0 px-0' },
                React.createElement(
                    'span',
                    { className: 'badge bg-secondary' },
                    class_dict["subj"],
                    ' ',
                    class_dict["crse"]
                ),
                React.createElement(
                    'span',
                    { className: 'text-secondary fw-light ms-1 overflow-hidden' },
                    class_dict["crn"]
                ),
                React.createElement(
                    'a',
                    { href: '#', className: 'stretched-link link-danger float-end', onClick: function onClick() {
                            return remove_class(class_dict);
                        } },
                    React.createElement('i', { className: 'bi bi-x-circle-fill' })
                )
            )
        );
    }

    if (new_class != null) {
        var already_contains = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = worksheet_classes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var course = _step.value;

                if (course["crn"] === new_class["crn"]) {
                    already_contains = true;
                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (!already_contains) worksheet_classes.push(new_class);
    }
    if (worksheet_classes.length === 0) {
        ReactDOM.render(React.createElement(
            'div',
            { className: 'badge pill rounded-pill my-2 bg-secondary' },
            'No courses in worksheet'
        ), document.getElementById("worksheet_container"));
    } else {
        ReactDOM.render(React.createElement(
            'div',
            null,
            worksheet_classes.map(function (class_dict) {
                return worksheet_class(class_dict);
            })
        ), document.getElementById("worksheet_container"));
    }
    filter_classes();
}

export function showArchived() {
    function change(e, val) {
        show_archived = val;
        filter_classes();
    }

    return React.createElement(
        'div',
        null,
        React.createElement(Checkbox, {
            name: 'showArchived',
            color: 'primary',
            onChange: change,
            defaultChecked: false,
            size: 'small'
        }),
        'Show past terms'
    );
}

export function hideConflicts() {
    function change(e, val) {
        hide_conflicts = val;
        filter_classes();
    }

    return React.createElement(
        'div',
        null,
        React.createElement(Checkbox, {
            name: 'showArchived',
            color: 'primary',
            onChange: change,
            defaultChecked: false,
            size: 'small'
        }),
        'Hide conflicting classes'
    );
}

var Accordion = withStyles({
    expanded: {}
})(MuiAccordion);

var AccordionSummary = withStyles({
    root: {
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56
        }
    },
    content: {
        '&$expanded': {
            margin: '12px 0'
        }
    },
    expanded: {}
})(MuiAccordionSummary);

function Class(class_dict) {
    var rem_color = class_dict["rem"] > 0 ? "bg-primary" : "bg-secondary";
    var attributes = class_dict["attributes"].map(function (attribute) {
        return React.createElement(
            'span',
            { key: attribute, className: 'pill badge bg-secondary ms-1' },
            attribute
        );
    });
    var offered_terms = class_dict["offered_terms_readable"].map(function (term, index) {
        return React.createElement(
            'span',
            { key: term, className: "pill badge bg-secondary" + (index === 0 ? "" : " ms-1") },
            term
        );
    });
    var archived = null;
    var add_to_worksheet_button = null;

    if (class_dict["term_float"] !== current_year) {
        archived = React.createElement(
            'span',
            { className: 'badge bg-danger me-1' },
            class_dict["term"]
        );
    } else {
        add_to_worksheet_button = React.createElement(
            IconButton,
            { 'aria-label': 'delete',
                size: 'small',
                onClick: function onClick() {
                    return update_worksheet(class_dict);
                }

            },
            React.createElement(AddIcon, { style: { color: "#FFFFFF" } })
        );
    }

    return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
            'div',
            { className: 'col my-auto p-0', style: { maxWidth: 24 } },
            add_to_worksheet_button
        ),
        React.createElement(
            'div',
            { className: 'col' },
            React.createElement(
                'div',
                { className: 'card mb-2 bg-light border-secondary border-2' },
                React.createElement(
                    Accordion,
                    null,
                    React.createElement(
                        AccordionSummary,
                        {
                            expandIcon: React.createElement(ExpandMoreIcon, null),
                            'aria-controls': 'panel1a-content',
                            id: 'panel1a-header'
                        },
                        React.createElement(
                            'div',
                            { className: 'card-body p-0 row' },
                            React.createElement(
                                'div',
                                { className: 'col my-auto' },
                                React.createElement(
                                    'span',
                                    { className: 'fs-6' },
                                    archived,
                                    class_dict["title"]
                                ),
                                React.createElement(
                                    'footer',
                                    { className: 'text-secondary fw-light' },
                                    React.createElement(
                                        'span',
                                        { className: 'badge bg-dark' },
                                        class_dict["subj"],
                                        ' ',
                                        class_dict["crse"]
                                    ),
                                    React.createElement(
                                        'span',
                                        { className: 'badge bg-primary ms-1' },
                                        class_dict["cred"]
                                    ),
                                    attributes,
                                    " ",
                                    class_dict["instructor"]
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'col my-auto' },
                                React.createElement(
                                    'span',
                                    { className: 'float-end me-1' },
                                    class_dict["time"]
                                ),
                                React.createElement(
                                    'span',
                                    { className: 'float-end badge bg-secondary me-1' },
                                    class_dict["days"]
                                ),
                                React.createElement(
                                    'span',
                                    { className: 'float-end badge bg-primary me-1' },
                                    class_dict["quad"]
                                )
                            )
                        )
                    ),
                    React.createElement(
                        AccordionDetails,
                        null,
                        React.createElement(
                            'div',
                            { className: 'col' },
                            React.createElement(
                                'div',
                                { className: 'row w-100' },
                                React.createElement(
                                    'div',
                                    { className: 'col-2' },
                                    React.createElement(
                                        'div',
                                        { className: 'row' },
                                        React.createElement(
                                            'span',
                                            null,
                                            React.createElement(
                                                'span',
                                                { className: "badge " + rem_color },
                                                class_dict["rem"]
                                            ),
                                            " ",
                                            'Open Slot',
                                            class_dict["rem"] === 1 ? " " : "s "
                                        )
                                    ),
                                    React.createElement(
                                        'div',
                                        { className: 'row' },
                                        React.createElement(
                                            'span',
                                            null,
                                            React.createElement(
                                                'span',
                                                {
                                                    className: 'badge bg-primary' },
                                                class_dict["location"]
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        'div',
                                        { className: 'row' },
                                        React.createElement(
                                            'span',
                                            null,
                                            React.createElement(
                                                'span',
                                                {
                                                    className: 'badge bg-dark' },
                                                'CRN'
                                            ),
                                            " ",
                                            class_dict["crn"]
                                        )
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'col text-secondary' },
                                    class_dict["desc"]
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'row' },
                                React.createElement(
                                    'span',
                                    null,
                                    offered_terms
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}

function intersects(start1, start2, end1, end2) {
    if (start1 == null || start2 == null || end1 == null || end2 == null) return false;
    return start1 >= start2 && start1 < end2 || start2 >= start1 && start2 < end1;
}

export default function filter_classes() {
    var filtered_classes_list = [];
    for (var i = 0; i < classes_list.length; i++) {
        var include_row = true;
        if (!show_archived && classes_list[i]["term_float"] !== current_year) continue;
        if (hide_conflicts) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = worksheet_classes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var course = _step2.value;

                    var same_day = false;
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = course["days"][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var letter = _step3.value;

                            if (classes_list[i]["days"] != null && classes_list[i]["days"].indexOf(letter) !== -1) {
                                same_day = true;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                    if (!same_day) break;

                    if (!intersects(course["start_date"], classes_list[i]["start_date"], course["end_date"], classes_list[i]["end_date"])) {
                        break;
                    }
                    if (intersects(course["start_time"], classes_list[i]["start_time"], course["end_time"], classes_list[i]["end_time"])) {
                        include_row = false;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
        for (var j = 0; j < filter_functions.length; j++) {
            if (!include_row) break;
            if (typeof filter_functions[j] === "function") include_row = filter_functions[j](classes_list[i][filter_keys[j]]);
        }
        if (include_row) filtered_classes_list.push(React.createElement(
            'div',
            { key: classes_list[i]["id"] },
            Class(classes_list[i])
        ));
        if (filtered_classes_list.length >= num_rows) break;
    }

    function show_more() {
        num_rows += base_num_rows;
        filter_classes();
    }

    var num_classes_alert = null;
    if (filtered_classes_list.length >= num_rows) {
        num_classes_alert = React.createElement(
            'div',
            { className: 'row mt-3' },
            React.createElement(
                'div',
                { className: 'col' },
                React.createElement(
                    'div',
                    { className: 'alert alert-dark' },
                    'Only showing first ',
                    num_rows,
                    ' courses.'
                )
            ),
            React.createElement(
                'div',
                { className: 'col' },
                React.createElement(
                    'button',
                    { className: 'btn btn-secondary my-auto float-end', onClick: show_more },
                    'Show more'
                )
            )
        );
    } else if (filtered_classes_list.length === 0) {
        num_classes_alert = React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col' },
                React.createElement(
                    'div',
                    { className: 'alert alert-dark' },
                    'No courses found'
                )
            )
        );
    }
    ReactDOM.render(React.createElement(
        'div',
        null,
        filtered_classes_list,
        num_classes_alert
    ), document.getElementById("classes_container"));
}