var express = require("express");
var router = express.Router({ mergeParams: true });

var Product = require("../models/products");
var Comment = require("../models/comment");


//New route: Shows form to create new comment for products.
router.get("/new", userLoggedIn, function (req, res) {
    Product.findById(req.params.id, function (e, products) {
        if (e) {
            console.log(e);
        } else {
            res.render("comments/new", { products: products });
        }
    });
});

//Create route: Create new comment object.
router.post("/", userLoggedIn, function (req, res) {
    Product.findById(req.params.id, function (e, product) {
        if (e) {
            console.log(e);
            res.redirect("/products");
        } else {
            Comment.create(req.body.comment, function (e, comment) {
                if (e) {
                    console.log(e);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    console.log(req.user.username)
                    product.comments.push(comment);
                    comment.save();
                    product.save();
                    res.redirect("/products/" + product._id);
                }
            });
        }
    });
});

//Middleware: Logs the user out of the session.
function userLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;