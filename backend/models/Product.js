const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  sellingPrice: {
    type: Number,
    required: true
  },

  costPrice: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    required: true
  },

  minStock: {
    type: Number,
    required: true
  },

  supplier: {
    type: String
  },

  expiryDate: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", ProductSchema);