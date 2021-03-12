//module returns the function getDate

// //single function return
// module.exports = getDate

//return multiple functions
module.exports.getDate = getDate
module.exports.getDay = getDay

function getDate(){
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    var day = today.toLocaleDateString("en-US", options);
    return day
}

function getDay(){
    var today = new Date();
    var options = {
        weekday: "long",
    };
    var day = today.toLocaleDateString("en-US", options);
    return day
}

//another way to declare the functions and module exports

// exports.getDate = function (){
//     var today = new Date();
//     var options = {
//         weekday: "long",
//         day: "numeric",
//         month: "long",
//     };
//     var day = today.toLocaleDateString("en-US", options);
//     return day
// }

// exports.getDay = function (){
//     var today = new Date();
//     var options = {
//         weekday: "long",
//     };
//     var day = today.toLocaleDateString("en-US", options);
//     return day
// }
