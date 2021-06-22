var express = require("express");
var router = express.Router({ mergeParams: true });

var Product = require("../models/products");
var Comment = require("../models/comment");

var middleware = require("../middleware/middleware.js");

//New route: Shows form to create new comment for products.
router.get("/new", middleware.userLoggedIn, function (req, res) {
    Product.findById(req.params.id, function (e, products) {
        if (e) {
            console.log(e);
        } else {
            res.render("comments/new", { products: products });
        }
    });
});

//Create route: Create new comment object.
router.post("/", middleware.userLoggedIn, function (req, res) {
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
                    comment.date = new Date();
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

//Edit route: Edit the comment using a given ID.
router.get("/:commentID/edit", middleware.commentOwnership, function (req, res) {
    Comment.findById(req.params.commentID, function (e, foundComment) {
        if (e) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { products_id: req.params.id, comment: foundComment });
        }
    });
});

//Update route: Update the comment using the ID.
router.put("/:commentID", function (req, res) {
    Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, function (e, updatedComment) {
        if (e) {
            res.redirect("back");
        } else {
            res.redirect("/products/" + req.params.id)
        }
    })
})

//Destroy route: Removes the comment if the active user is authenticated to do so.
router.delete("/:commentID", middleware.commentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.commentID, function (e) {
        if (e) {
            res.redirect("back");
        } else {
            res.redirect("/products/" + req.params.id);
        }
    })
})

module.exports = router;