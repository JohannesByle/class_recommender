import ReactDOM from "react-dom";
import render_classes from "./index";
import React from "react";
// import {Rating} from "@material-ui/lab"
//
// function SimpleRating(custom_function) {
//     return (
//         <Rating
//             name="simple-controlled"
//             value={null}
//             onChange={custom_function}
//         />
//     );
// }

// export function RateClassForm(course) {
//
//
//     let rating = null
//
//     function add_rating() {
//         if (rating == null)
//             return
//
//         course["rating"] = rating
//         fetch("/rate_class",
//             {
//                 method: "POST",
//                 body: JSON.stringify(course)
//             }
//         ).then(r => r.json()).then(
//             (result) => render_classes(result, false, true),
//             (error) => console.log(error));
//     }
//
//
// }


export default function render_rate_class_form() {
    function stop_rating() {
        ReactDOM.unmountComponentAtNode(document.getElementById("add_class_form"));
        render_classes(my_courses, false, false);
    }

    ReactDOM.render(React.createElement(
        "div",
        { className: "mx-auto", style: { maxWidth: 400 } },
        React.createElement(
            "div",
            { className: "mx-auto mt-3 text-center" },
            React.createElement(
                "button",
                { className: "btn btn-secondary", onClick: stop_rating },
                "Stop Rating Classes"
            )
        )
    ), document.getElementById("add_class_form"));
    render_classes(my_courses, false, true);
}