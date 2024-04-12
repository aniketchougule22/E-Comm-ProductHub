import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const BASE_URL = process.env.REACT_APP_YOUR_BASE_URL;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleAddProductData = async () => {
    try {
      if (!name || !price || !category || !company) {
        setError(true);
        return false;
      }

      const user_id = JSON.parse(localStorage.getItem("user"))._id;
      let response = await fetch(`${BASE_URL}/products`, {
        method: "post",
        body: JSON.stringify({ name, price, category, company, user_id, icon }),
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          "Content-Type": "application/json",
        },
      });
      response = await response.json();
      //   console.log("response", response);
      if (response.status === true) {
        navigate("/");
        // alert(response.message);
      } else {
        alert("An error occurred while adding the product. Please try again.");
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="product">
      <h1 className="form-title">Add Product</h1>
      <input
        className="input-box"
        type="text"
        placeholder="Enter product name"
        value={name}
        required
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      {error && !name && (
        <span className="invalid-input">Enter valid name</span>
      )}

      <input
        className="input-box"
        type="text"
        placeholder="Enter product price"
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
        }}
      />
      {error && !price && (
        <span className="invalid-input">Enter valid price</span>
      )}

      <input
        className="input-box"
        type="text"
        placeholder="Enter product category"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      />
      {error && !category && (
        <span className="invalid-input">Enter valid category</span>
      )}

      <input
        className="input-box"
        type="text"
        placeholder="Enter product company"
        value={company}
        onChange={(e) => {
          setCompany(e.target.value);
        }}
      />
      {error && !company && (
        <span className="invalid-input">Enter valid company</span>
      )}

      <input
        className="input-box"
        type="text"
        placeholder="Enter image url"
        value={icon}
        onChange={(e) => {
          setIcon(e.target.value);
        }}
      />

      <button className="app-button" onClick={handleAddProductData}>
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
