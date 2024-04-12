const express = require("express");
const router = express.Router();
const users = require("../../models/users");
const generate_token = require("../../helpers/generate_token");
const bcrypt = require("bcryptjs");

/* Signup */
router.post("/signup", async (req, res) => {
  try {
    let salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    const create = await users.insertOne(req.body);
    if (create._id) {
      const token = generate_token.create_token(create._id);
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "User singup successfully..!",
        data: create,
        token: token,
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

/* Login */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const get = await users.findOne({ email: email });
    if (get != null) {
      let pass = bcrypt.compareSync(password, get.password);
      if (pass) {
        let token = generate_token.create_token(get._id);
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "User logged in successfully..!",
          data: get,
          token: token,
        });
      } else {
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: "Invalid email or password..!",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid email or password..!",
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
