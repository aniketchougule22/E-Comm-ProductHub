const { query } = require("express");
const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },

  password: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: new Date(),
  },
});

let users = mongoose.model("users", userSchema);

const insertOne = async (body) => {
  try {
    return await new users(body).save();
  } catch (error) {
    return error;
  }
};

const find = async () => {
  try {
    return await users.find();
  } catch (error) {
    return error;
  }
};

const findOne = async (query) => {
  try {
    return await users.findOne(query);
  } catch (error) {
    return error;
  }
};

const updateOne = async (match, query) => {
  try {
    return await users.findByIdAndUpdate(match, query);
  } catch (error) {
    return error;
  }
};

module.exports = {
  insertOne,
  find,
  findOne,
  updateOne,
};
