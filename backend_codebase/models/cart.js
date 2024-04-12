const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: {
    type: Object,
    ref: "products",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  totalPrice: {
    type: Number,
  },

  items: [CartItemSchema],
});

module.exports = mongoose.model("cart", CartSchema);
