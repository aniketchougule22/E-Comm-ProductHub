const express = require("express");
const router = express.Router();
const Cart = require("../../models/cart");
const auth = require("../../middlewares/auth").isValidToken;

/* Add product to cart */
router.post("/add", auth, async (req, res) => {
  try {
    const { product, totalPrice, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({ status: false, statusCode: 400, msg: "Invalid productId or quantity" });
    }
    let cart = await Cart.findOne({ user: req["AuthenticateUser"]._id });

    if (!cart) {
      cart = new Cart({
        user: req["AuthenticateUser"]._id,
        totalPrice: 0,
        items: [],
      });
    }

    const existing_product = cart.items.find(
      (item) => item.product._id.toString() === product._id
    );

    if (existing_product) {
      existing_product.quantity += quantity;
      cart.totalPrice += totalPrice;
    } else {
      cart.items.push({ product, quantity });
      cart.totalPrice += totalPrice;
    }

    await cart.save();
    cart.items.forEach((item) => {
      cart.totalPrice += item.quantity * item.product.price;
    });

    res.json({ status: true, statusCode: 200, data: cart });
  } catch (err) {
    res.status(500).send({ status: false, statusCode: 500, msg: "something went wrong..!", error: err.stack });
  }
});

/* Remove product from cart */
router.post("/remove", auth, async (req, res) => {
  try {
    const { productId, totalPrice, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ msg: "Invalid productId or quantity" });
    }

    const cart = await Cart.findOne({ user: req["AuthenticateUser"]._id });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: "Product not found in cart" });
    }

    if (cart.items[itemIndex].quantity < quantity) {
      return res.status(400).json({ msg: "Invalid quantity" });
    }

    if (cart.items[itemIndex].quantity === quantity) {
      cart.items.splice(itemIndex, 1);
      cart.totalPrice = cart.totalPrice - totalPrice;
    } else {
      cart.items[itemIndex].quantity -= quantity;
      cart.totalPrice = cart.totalPrice - totalPrice;
    }

    await cart.save();

    res.json({ status: true, statusCode: 200, data: cart });
  } catch (err) {
    res.status(500).send({ status: false, statusCode: 500, msg: "something went wrong..!", error: err.stack });
  }
});

/* Get cart details */
router.get("/", auth, async (req, res) => {
  try {
    const get = await Cart.findOne({ user: req["AuthenticateUser"]._id });
    if (get == null) {
      res.status(200).send({ status: false, statusCode: 200, msg: "Your Cart is empty..!", data: get });
    } else {
      res.status(200).send({ status: true, statusCode: 200, msg: "Cart data found..!", data: get });
    }
  } catch (error) {
    res.status(500).send({ status: false, statusCode: 500, msg: "something went wrong..!", error: error.stack });
  }
});

module.exports = router;
