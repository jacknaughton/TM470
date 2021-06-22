var express = require("express");
var index = express();
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var User = require("./models/user");

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

// Initialised passportJS to start a session.
index.use(passport.initialize());
index.use(passport.session());
passport.use(new passport_local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware - Sets the active user.
index.use(function (req, res, next) {
  res.locals.activeUser = req.user;
  next();
})

// Cloud database - connects to the database stored online using mongoDB.
// Auto generated code from MongoDB.
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

// Allows ejs to read the body of the webpage and parse the data.
index.use(bodyParser.urlencoded({ extended: true }));

// Allows ejs to read the directory for the public folder containing the CSS file.
index.use(express.static(__dirname + "/public"));

// Allows ejs to use PUT and DELETE methods.
index.use(methodOverride("_method"));

// Set all routes to ejs files.
index.set("view engine", "ejs");

// Completes part of the route.
index.use(authRoutes);
index.use("/products/:id/comments", commentsRoutes);
index.use("/products", productsRoutes);

// Starts the server.
index.listen(process.env.PORT || 3000, function () {
  console.log("Server started.");
});