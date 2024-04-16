const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const products = require("../../models/products");
const auth = require("../../middlewares/auth").isValidToken;

/* Add product */
router.post("/", auth, async (req, res) => {
  try {
    const create = await products.insertOne(req.body);
    if (create._id) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Product added successfully..!",
        data: create,
      });
    } else {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "something went wrong..!",
        error: create,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

/* Get all products */
router.get("/all_products", auth, async (req, res) => {
  try {
    const get = await products.find(req.query);
    if (get.length > 0) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Products found..!",
        data: get,
      });
    } else {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "No products available..!",
        data: get,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

/* Get all products with pagination */
router.get("/", auth, async (req, res) => {
  try {
    const get = await products.get_products_with_pagination(req.query);
    if (get) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Products found..!",
        data: get,
      });
    } else {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "No products available..!",
        data: get,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

/* Get product by _id */
router.get("/product_by_id", auth, async (req, res) => {
  try {
    const get = await products.findOne({
      _id: new mongoose.Types.ObjectId(req.query.product_id),
    });
    if (get != null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Product found..!",
        data: get,
      });
    } else {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid product_id..!",
        data: get,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

/* Update product */
router.patch("/", auth, async (req, res) => {
  try {
    const update = await products.updateOne(
      { _id: new mongoose.Types.ObjectId(req.body._id) },
      { $set: req.body }
    );
    if (update != null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Product updated successfully..!",
        data: update,
      });
    } else {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "document not found..!",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

/* Delete product */
router.delete("/", auth, async (req, res) => {
  try {
    const remove = await products.deleteOne({
      _id: new mongoose.Types.ObjectId(req.query.product_id),
    });
    if (remove != null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Product deleted successfully..!",
      });
    } else {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "document not found..!",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

module.exports = router;
