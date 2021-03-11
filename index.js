var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

//Temorary database.
var hardware = [
  {
    name: "cpu",
    image:
      "https://icdn2.digitaltrends.com/image/digitaltrends/amd-ryzen-7-cpu-inhandpins-3-510x510-c-ar1.jpg",
  },
];

//Set all routes to ejs files.
app.set("view engine", "ejs");

//Home page route.
app.get("/", function (req, res) {
  res.render("home");
});

//Sends you to the hardware page.
app.get("/hardware", function (req, res) {
  //Passing throughh the data.
  res.render("hardware", { hardware: hardware });
});

//Create new hardware object.
app.post("/hardware", function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var newHardware = { name: name, image: image };
  hardware.push(newHardware);
  res.redirect("/hardware");
});

//Shows form to create new hardware object
app.get("/hardware/new", function (req, res) {
  res.render("new");
});

//Starts the server.
app.listen(3000, function () {
  console.log("Server started.");
});
