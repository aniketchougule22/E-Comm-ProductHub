const express = require("express");
const app = express();
require("dotenv").config();
require("./config/db");
const cors = require("cors");

app.use(express.json());
app.use(cors());

const { users, products, cart } = require("./src/");

app.use("/users", users);
app.use("/products", products);
app.use("/cart", cart);

app.use((req, res, next) => {
  res.status(404).json({
    message:
      "Ohh you are lost, read the API documentation to find your way back home :)",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
