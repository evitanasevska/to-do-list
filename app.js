//start server
const express = require("express");
const app = express();
app.listen(3000, function () {
  console.log("Server is up and running on port 3000.");
});

//body parser
app.use(express.urlencoded({ extended: true }));

//use public files
app.use(express.static("public"));

//EJS templating activation
app.set("view engine", "ejs");

//importing date module
const date = require(__dirname + "/date.js")

//in order to add new task for the list
//we must declare an array (cuz otherwise it overwrites every new task with the next new task) outside any methods
//then we take the value from POST request & redirect to root route
//then render the value and pass it to the HTML in GET request
var tasks = ["Buy Food", "Cook food", "Eat food"];

app.get("/", function (req, res) {
  
  ////get current date without using external module
  // var today = new Date();
  // var options = {
  //     weekday: "long",
  //     day: "numeric",
  //     month: "long",
  // };
  // var day = today.toLocaleDateString("en-US", options);

  ////get current date value from date.js module (single function in module)
  // var day = date()

  //get current date value from date.js module (multiple functions in module)
  var day = date.getDate()

  //EJS pass values to HTML
  //tasks array is regulated to print each element as new list item in ejs file
  res.render("list", { listTitle: day, newListItem: tasks });

  // NOT IN USE!
  // initial day switching concept, later substituted by toLocaleDateString("en-US", options)
  function swithDaysOfTheWeek() {
    var day = "";
    switch (today.getDay()) {
      case 0:
        day = "SUNDAY";
        break;
      case 1:
        day = "MONDAY";
        break;
      case 2:
        day = "TUESDAY";
        break;
      case 3:
        day = "WEDNESDAY";
        break;
      case 4:
        day = "THURSDAY";
        break;
      case 5:
        day = "FRIDAY";
        break;
      case 6:
        day = "SATURDAY";
        break;
      default:
        console.log(today.getDay());
        break;
    }
  }
});

app.post("/", function (req, res) {
  //take newTask value from HTML form
  var task = req.body.newTask;
  
  if (req.body.list == "Work") {
    //if req came from work list (we ge value from HTML button), then add task to Work List
    workTasks.push(task);
    //redirect to work route if we're adding a task to work list
    res.redirect("/work")
  } else {
    //append the value to the tasks array
    tasks.push(task);
    //redirect to root route GET method & render value
    res.redirect("/");
    //redirecting to home for regular list
  }
}); 

var workTasks = [];

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItem: workTasks });
});

// app.post("/work", function (req, res) {
//   var task = req.body.newTask;
//   workTasks.push(task);
//   res.redirect("/work");
// });

//about page
app.get("/about",function(req, res){
    res.render("about")
})