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

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/products",
        failureRedirect: "/login",
    })
);

//Logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/products");
});

//Middleware: Logs the user out of the session.
// function userLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;