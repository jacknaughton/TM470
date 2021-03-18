var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var mongoose = require("mongoose");
//Offline database.
// mongoose.connect("mongodb://localhost:27017/products", {
//   useNewUrlParser: true,
// });

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

//Schema setup
var productSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

var Product = mongoose.model("Product", productSchema);
// Product.create(
//   {
//   name: "cpu",
//   image: "https://i.ebayimg.com/images/g/Ox4AAOSwEYNfBb~s/s-l300.jpg",
//   description: "Test description."
// }, function(e, product){
//   if(e){
//     console.log(e);
//   } else {
//     console.log("New product created: ");
//     console.log(product)
//   }
// });

// Product.create(
//   {
//   name: "ram",
//   image: "https://images-na.ssl-images-amazon.com/images/I/419SRJu4kHL._AC_.jpg",
// }, function(e, product){
//   if(e){
//     console.log(e);
//   } else {
//     console.log("New product created: ");
//     console.log(product)
//   }
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//Set all routes to ejs files.
app.set("view engine", "ejs");

//Home page route.
app.get("/", function (req, res) {
  res.render("home");
});

//Index route: Sends you to the products page.
app.get("/products", function (req, res) {
  //Get all products from the database.
  Product.find({}, function (e, allProducts) {
    if (e) {
      console.log(e);
    } else {
      res.render("products", { products: allProducts });
    }
  });
});

//Create route: Create new product object.
app.post("/products", function (req, res) {
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
app.get("/products/new", function (req, res) {
  res.render("new");
});

//Show route: Render show template with given id.
app.get("/products/:id", function (req, res) {
  //Find product with given id.
  Product.findById(req.params.id, function (e, foundProduct) {
    if (e) {
      console.log(e);
    } else {
      res.render("show", { products: foundProduct });
    }
  });
});

//Starts the server.
app.listen(3000, function () {
  console.log("Server started.");
});
