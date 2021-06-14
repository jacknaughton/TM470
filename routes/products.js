var express = require("express");
var router = express.Router();

var Product = require("../models/products");

var middleware = require("../middleware/middleware.js");

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
router.post("/", middleware.userLoggedIn, function (req, res) {
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
            console.log(createdProduct)
            res.redirect("/products");
        }
    });
});

//New route: Shows form to create new product object
router.get("/new", middleware.userLoggedIn, function (req, res) {
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

//Edit route: Render edit form using given ID.
router.get("/:id/edit", middleware.productOwnership, function (req, res) {
    Product.findById(req.params.id, function (e, foundProduct) {
        res.render("products/edit", { product: foundProduct });
    });
});

//Update route: Updates object using given ID from form.
router.put("/:id", middleware.productOwnership, function (req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.product, function (e, updatedProduct) {
        if (e) {
            res.redirect("/products")
        } else {
            res.redirect("/products/" + req.params.id)
        }
    })
});

//Destroy route:
router.delete("/:id", middleware.productOwnership, function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (e) {
        if (e) {
            res.redirect("/products");
        } else {
            res.redirect("/products");
        }
    })
});

module.exports = router;