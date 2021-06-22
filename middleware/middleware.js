// Creates the middleware object.
var middlewareObject = {};

// Requires the models.
var Product = require("../models/products");
var Comment = require("../models/comment");


middlewareObject.productOwnership = function productOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Product.findById(req.params.id, function (e, foundProduct) {
            if (e) {
                res.redirect("back");
            } else {
                // If the user owns the post, allow them to proceed with the edit/deletion.
                if (foundProduct.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // If the user does not own the post, redirect them back one page.
                    res.redirect("back")
                }
            }
        });
    } else {
        res.redirect("back")
    }
}

middlewareObject.commentOwnership = function commentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentID, function (e, foundComment) {
            if (e) {
                res.redirect("back");
            } else {
                // If the user owns the comment, allow them to proceed with the edit/deletion.
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // If the user does not own the comment, redirect them back one page.
                    res.redirect("back")
                }
            }
        });
    } else {
        res.redirect("back")
    }
}

middlewareObject.userLoggedIn = function userLoggedIn(req, res, next) {
    // If the user is authenticated by being logged in, proceed next.
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

// Export the middleware object and its functions.
module.exports = middlewareObject;