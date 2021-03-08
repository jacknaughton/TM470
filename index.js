var express = require("express");
var app = express();

//Set all routes to ejs files.
app.set("view engine", "ejs");

//Home page route.
app.get("/", function(req,res){
    res.render("home");
})

app.get("/hardware", function(req,res){
    //Temorary database.
    var hardware = [
        {name: "cpu", image: "https://icdn2.digitaltrends.com/image/digitaltrends/amd-ryzen-7-cpu-inhandpins-3-510x510-c-ar1.jpg"}
    ]
    //Passing throughh the data.
    res.render("hardware", {hardware:hardware});
})

//Starts the server.
app.listen(3000, function () {
    console.log("Server started.");
});