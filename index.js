var express = require("express");
var index = express();
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

// var Product = require("./models/products");
// var Comment = require("./models/comment");
var User = require("./models/user");

var seedDB = require("./views/seeds");

var passport = require("passport");
var passport_local = require("passport-local");

var authRoutes = require("./routes/auth");
var commentsRoutes = require("./routes/comments");
var productsRoutes = require("./routes/products");

var methodOverride = require("method-override");


index.use(
  require("express-session")({
    secret: "password",
    resave: false,
    saveUninitialized: false,
  })
);

index.use(passport.initialize());
index.use(passport.session());
passport.use(new passport_local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware
index.use(function (req, res, next) {
  res.locals.activeUser = req.user;
  next();
})

//Cloud database.
const uri =
  "mongodb+srv://jacknaughton1:34Bxo1WBDhxxXara@tm470.rorwa.mongodb.net/project?retryWrites=true&w=majority";
mongoose.connect(
  uri,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err, db) {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to database");
    }
  }
);

// seedDB();

index.use(bodyParser.urlencoded({ extended: true }));
index.use(express.static(__dirname + "/public"));
index.use(methodOverride("_method"));

//Set all routes to ejs files.
index.set("view engine", "ejs");

index.use(authRoutes);
index.use("/products/:id/comments", commentsRoutes);
index.use("/products", productsRoutes);

//Starts the server.
index.listen(3000, function () {
  console.log("Server started.");
});
