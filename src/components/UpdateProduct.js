import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const BASE_URL = process.env.REACT_APP_YOUR_BASE_URL;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [icon, setIcon] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getProductDetailsById();
  }, []);

  const getProductDetailsById = async () => {
    try {
      let response = await fetch(
        `${BASE_URL}/products/product_by_id?product_id=${params.id}`,
        {
          method: "get",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      response = await response.json();

      if (response.status === true) {
        setName(response.data.name);
        setPrice(response.data.price);
        setCategory(response.data.category);
        setCompany(response.data.company);
        setIcon(response.data.icon);
      } else {
        alert(
          "An error occurred while fetching the product. Please try again."
        );
      }
    } catch (error) {
      return error;
    }
  };

  const handleUpdateProductData = async () => {
    try {
      const _id = params.id;
      let response = await fetch(`${BASE_URL}/products`, {
        method: "PATCH",
        body: JSON.stringify({ _id, name, price, category, company, icon }),
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          "Content-Type": "application/json",
        },
      });
      response = await response.json();
      if (response.status === true) {
        navigate("/");
        // alert(response.message);
      } else {
        alert(
          "An error occurred while updating the product. Please try again."
        );
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="product">
      <h1 className="form-title">Update Product</h1>
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

      <input
        className="input-box"
        type="text"
        placeholder="Enter product price"
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
        }}
      />

      <input
        className="input-box"
        type="text"
        placeholder="Enter product category"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      />

      <input
        className="input-box"
        type="text"
        placeholder="Enter product company"
        value={company}
        onChange={(e) => {
          setCompany(e.target.value);
        }}
      />

      <input
        className="input-box"
        type="text"
        placeholder="Enter image url"
        value={icon}
        onChange={(e) => {
          setIcon(e.target.value);
        }}
      />

      <button className="app-button" onClick={handleUpdateProductData}>
        Update Product
      </button>
    </div>
  );
};

export default UpdateProduct;
