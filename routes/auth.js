var express = require("express");
var router = express.Router();

var passport = require("passport");

var User = require("../models/user")

//Root route: Home page route.
router.get("/", function (req, res) {
    res.render("home");
});

//Show route: Show register form.
router.get("/register", function (req, res) {
    res.render("register");
});

// Create route: Signs up the user and authenticates them.
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (e, user) {
        if (e) {
            console.log(e);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/products");
        });
    });
});

//Show route: Show login form.
router.get("/login", function (req, res) {
    res.render("login");
});

// Create route: Authenticates the user, if successful, redirect them to the products page, if failure, redirect them to the login page.
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/products",
        failureRedirect: "/login",
    })
);

//Logout route: Logs the active user out of their session.
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/products");
});

module.exports = router;