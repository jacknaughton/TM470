var middlewareObject = {};
var Product = require("../models/products");
var Comment = require("../models/comment");

middlewareObject.productOwnership = function productOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Product.findById(req.params.id, function (e, foundProduct) {
            if (e) {
                res.redirect("back");
            } else {
                if (foundProduct.author.id.equals(req.user._id)) {
                    next();
                } else {
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
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back")
                }
            }
        });
    } else {
        res.redirect("back")
    }
}

middlewareObject.userLoggedIn = function userLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObject;