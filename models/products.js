var mongoose = require("mongoose");

//Schema setup
var productSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
  });
  
module.exports = mongoose.model("Product", productSchema);