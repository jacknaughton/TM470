var express = require("express");
var index = express();
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var Product = require("./models/products");
var Comment = require("./models/comment");

var seedDB = require("./views/seeds");

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

seedDB();

index.use(bodyParser.urlencoded({ extended: true }));
index.use(express.static(__dirname + "/public"));

//Set all routes to ejs files.
index.set("view engine", "ejs");

//Home page route.
index.get("/", function (req, res) {
  res.render("home");
});

//Index route: Sends you to the products page.
index.get("/products", function (req, res) {
  //Get all products from the database.
  Product.find({}, function (e, allProducts) {
    if (e) {
      console.log(e);
    } else {
      res.render("products/products", { products: allProducts });
    }
  });
});

//Create route: Create new product object.
index.post("/products", function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newProduct = { name: name, image: image, description: description };
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
index.get("/products/new", function (req, res) {
  res.render("products/new");
});

//Show route: Render show template with given id.
index.get("/products/:id", function (req, res) {
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

index.get("/products/:id/comments/new", function (req, res) {
  Product.findById(req.params.id, function (e, products) {
    if (e) {
      console.log(e);
    } else {
      res.render("comments/new", {products: products});
    }
  });
});

index.post("/products/:id/comments", function(req,res){
  Product.findById(req.params.id, function(e, product){
    if(e){
      console.log(e);
      res.redirect("/products");
    } else {
      Comment.create(req.body.comment, function(e, comment){
        if(e){
          console.log(e);
        } else{
          product.comments.push(comment);
          product.save();
          res.redirect("/products/" + product._id);
        }
      })
    }
  })
})

//Starts the server.
index.listen(3000, function () {
  console.log("Server started.");
});
