var express = require("express");
var index = express();
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var Product = require("./models/products");
var Comment = require("./models/comment");
var User = require("./models/user");

var seedDB = require("./views/seeds");

var passport = require("passport");
var passport_local = require("passport-local");

index.use(
  require("express-session")({
    secret: "password",
    resave: false,
    saveUninitialized: false,
  })
);

index.use(passport.initialize());
index.use(passport.session());
passport.use(new passport_local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware
index.use(function(req,res,next){
  res.locals.activeUser = req.user;
  next();
})

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
      res.render("products/products", {
        products: allProducts
      });
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

//Show route: Render products show template with given id.
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

//New route: Shows form to create new comment for products.
index.get("/products/:id/comments/new", userLoggedIn, function (req, res) {
  Product.findById(req.params.id, function (e, products) {
    if (e) {
      console.log(e);
    } else {
      res.render("comments/new", { products: products });
    }
  });
});

//Create route: Create new comment object.
index.post("/products/:id/comments", userLoggedIn, function (req, res) {
  Product.findById(req.params.id, function (e, product) {
    if (e) {
      console.log(e);
      res.redirect("/products");
    } else {
      Comment.create(req.body.comment, function (e, comment) {
        if (e) {
          console.log(e);
        } else {
          product.comments.push(comment);
          product.save();
          res.redirect("/products/" + product._id);
        }
      });
    }
  });
});

//Show route: Show register form.
index.get("/register", function (req, res) {
  res.render("register");
});

index.post("/register", function (req, res) {
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
index.get("/login", function (req, res) {
  res.render("login");
});

index.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/login",
  })
);

//Logout route
index.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/products");
});

function userLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//Starts the server.
index.listen(3000, function () {
  console.log("Server started.");
});
