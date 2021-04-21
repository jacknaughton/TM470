var mongoose = require("mongoose");
var Products = require("../models/products");
var Comment = require("../models/comment");

var data = [
  {
    name: "CPU",
    image:
      "https://img.dtcn.com/image/digitaltrends/amd-ryzen-7-cpu-inhandpins-3.jpg",
    description: "This is an image of a CPU.",
  },
  {
    name: "CPU",
    image:
      "https://img.dtcn.com/image/digitaltrends/amd-ryzen-7-cpu-inhandpins-3.jpg",
    description: "This is an image of a CPU.",
  },
  {
    name: "CPU",
    image:
      "https://img.dtcn.com/image/digitaltrends/amd-ryzen-7-cpu-inhandpins-3.jpg",
    description: "This is an image of a CPU.",
  },
];

function seedDB() {
  Products.remove({}, function (e) {
    if (e) {
      console.log(e);
    }
    console.log("Products removed.");
    // Add products
    data.forEach(function (seed) {
      Products.create(seed, function (e, products) {
        if (e) {
          console.log(e);
        } else {
          console.log("Product added.");
          // Add comments
          Comment.create(
            {
              text: "Comment about the CPU.",
              author: "Jack",
            },
            function (e, comment) {
              if (e) {
                console.log(e);
              } else {
                products.comments.push(comment);
                products.save();
                console.log("Comment saved.");
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
