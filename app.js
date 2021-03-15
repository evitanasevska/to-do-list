//start server
const express = require("express");
const app = express();

//heroku
app.listen(process.env.PORT || 4000, function(){
  console.log("Server is running on port 3000.");
})

// app.listen(4000, function(){
//   console.log("Server running on port 3000.")
// })

const _ = require("lodash")

// //importing date module
// const date = require(__dirname + "/date.js")

//mongoose
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://admin:admin@cluster0.itj3w.mongodb.net/todoDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})

const itemsSchema = {
  name: {
    type: String,
    required: true
  }
}

const listSchema = {
  name: {
    type: String,
    required: true
  },
  items: [itemsSchema]
}

const itemsModel = mongoose.model("item", itemsSchema)
const listModel = mongoose.model("list", listSchema)

const item1 = new itemsModel({
  name: "Welcome to your to do list"
})

const item2 = new itemsModel({
  name: "Hit the + button to add a new item"
})

const item3 = new itemsModel({
  name: "<-- Click to delete an item"
})

const defaultItems = [item1, item2, item3]

//body parser
app.use(express.urlencoded({ extended: true }));

//use public files
app.use(express.static("public"));

//EJS templating activation
app.set("view engine", "ejs");

//in order to add new task for the list
//we must declare an array (cuz otherwise it overwrites every new task with the next new task) outside any methods
//then we take the value from POST request & redirect to root route
//then render the value and pass it to the HTML in GET request
// var tasks = ["Buy Food", "Cook food", "Eat food"];

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
  // var day = date.getDate()

  //EJS pass values to HTML
  //tasks array is regulated to print each element as new list item in ejs file
  // res.render("list", { listTitle: day, newListItem: tasks });
  
  itemsModel.find(function(err, items){
    if(items.length === 0){
      itemsModel.insertMany(defaultItems, function(err){
        if(err){
          console.log(err)
        }else{
          console.log("Default items added successfully.")
        }
      })
      //if there are no items it adds the defaults
      //then redirects to home route, the if is not executed
      //because now we have items in our array
      //continues to else where it renders the default items on screen
      res.redirect("/")
    } else {
      res.render("list", { listTitle: "Today", newListItem: items});
    }
  })

  // itemsModel.updateOne({name: "<-- Click on the checkbox to delete an item"}, {name: "<-- Hit to delete item"}, function(err){
  //   if(err){
  //     console.log(err)
  //   }else{
  //     console.log("Item deleted successfully.")
  //   }
  // })

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
  const itemName = req.body.newTask;
  const listName = _.lowerCase(req.body.list)

  //pass item name and make new item 
  const item = new itemsModel({
    name: itemName
  })

  if (listName === "today"){
  //add new item/task in table
  item.save()
  res.redirect("/")
  } else {
    listModel.findOne({name: listName}, function(err,foundList){
      foundList.items.push(item)
      foundList.save()
      res.redirect("/" + listName)
    })
  }
}); 

app.post("/delete", function(req,res){
  const checkedItem = req.body.checkbox
  const listName = _.lowerCase(req.body.listName)

  if(listName === "today"){
    itemsModel.findByIdAndRemove(checkedItem, function(err){
      if(!err){
        console.log("Checked item deleted successfully.")
        res.redirect("/")
      }
    })
  } else {
    listModel.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName)
      }
    })
  }
})

app.get("/:listName", function(req, res){
  var routingListName = _.lowerCase(req.params.listName)

  listModel.findOne({name: routingListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        //create new list
        const list = new listModel({
          name: routingListName,
          items: defaultItems
        })
        list.save()
        res.redirect("/" + routingListName)
      }else{
        //show existing list
        // console.log("Exists!")
        res.render("list", { listTitle: _.capitalize(foundList.name), newListItem: foundList.items});
      }
    }
  })
})

// var workTasks = [];

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItem: workTasks });
// });

// app.post("/work", function (req, res) {
//   var task = req.body.newTask;
//   workTasks.push(task);
//   res.redirect("/work");
// });

