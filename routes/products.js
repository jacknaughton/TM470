var express = require("express");
var router = express.Router();

var Product = require("../models/products");

//Index route: Sends you to the products page.
router.get("/", function (req, res) {
    //Get all products from the database.
    Product.find({}, function (e, allProducts) {
        if (e) {
            console.log(e);
        } else {
            res.render("products/products", {
                products: allProducts
            });
        }
    });
});

//Create route: Create new product object.
router.post("/", userLoggedIn, function (req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var description = req.body.description;
    var image = req.body.image;
    var name = req.body.name;
    var newProduct = {
        author: author,
        description: description,
        image: image,
        name: name        
    };
    //Create a new product then save it to the database.
    Product.create(newProduct, function (e, createdProduct) {
        if (e) {
            console.log(e);
        } else {
            res.redirect("/products");
        }
    });
});

//New route: Shows form to create new product object
router.get("/new", userLoggedIn, function (req, res) {
    res.render("products/new");
});

//Show route: Render products show template with given id.
router.get("/:id", function (req, res) {
    //Find product with given id.
    Product.findById(req.params.id)
        .populate("comments")
        .exec(function (e, foundProduct) {
            if (e) {
                console.log(e);
            } else {
                res.render("products/show", { products: foundProduct });
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