import React, { useEffect, useState } from "react";
import { Link, resolvePath, useNavigate } from "react-router-dom";
import CartDetails from "./CartDetails";

const ProductList = () => {
  const BASE_URL = process.env.REACT_APP_YOUR_BASE_URL;
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
    getCartDetails();
  }, []);

  const getCartDetails = async () => {
    try {
      const user_id = JSON.parse(localStorage.getItem("user"))._id;
      let response = await fetch(`${BASE_URL}/cart`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      response = await response.json();
      if (response.status === true) {
        const cartData = response.data;
        const newProductQuantities = {};
        cartData.items.forEach((item) => {
          newProductQuantities[item.product._id] = item.quantity;
        });
        setProductQuantities(newProductQuantities);
      } else {
        // alert("An error occurred while fetching cart details.");
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const getProducts = async () => {
    try {
      const user_id = JSON.parse(localStorage.getItem("user"))._id;
      let response = await fetch(
        `${BASE_URL}/products/all_products?user_id=${user_id}`,
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
      setProducts(response.data);
    } catch (error) {
      return error;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      let response = await fetch(
        `${BASE_URL}/products?product_id=${productId}`,
        {
          method: "delete",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      response = await response.json();
      if (response.status === true) {
        getProducts();
        //   alert(response.message);
      } else {
        alert(
          "An error occurred while deleting the product. Please try again."
        );
      }
    } catch (error) {
      return error;
    }
  };

  const handleSearchProduct = async (event) => {
    try {
      const user_id = JSON.parse(localStorage.getItem("user"))._id;
      let response = await fetch(
        `${BASE_URL}/products/all_products?user_id=${user_id}&search_text=${event.target.value}`,
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
      setProducts(response.data);
    } catch (error) {
      return error;
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const productId = product._id;
      const totalPrice = product.price;
      let response = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ product, totalPrice, quantity: 1 }),
      });
      response = await response.json();
      if (response.data.items) {
        alert("Product added to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleRemoveFromCart = async (product) => {
    try {
      const productId = product._id;
      const totalPrice = product.price;
      let response = await fetch(`${BASE_URL}/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ productId, totalPrice, quantity: 1 }), // Assuming you are removing only one quantity of the product
      });
      response = await response.json();
      if (response.data.items) {
        alert("Product removed from cart");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleIncrementQuantity = (productId) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  };

  const handleDecrementQuantity = (productId) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(0, (prevQuantities[productId] || 0) - 1),
    }));
  };

  return (
    <div className="product-list">
      <h2>Product List</h2>

      <input
        className="search-product-box"
        type="text"
        placeholder="Search Product"
        onChange={handleSearchProduct}
      />

      <div className="table-data-wrapper">
        <div className="table-data">
          <ul className="header-list">
            {/* <li>Sr No</li> */}
            {/* <li>Image</li> */}
            <li>Name</li>
            <li>Company</li>
            <li>Price</li>
            <li>Category</li>
            <li>Action</li>
            <li>Add To Cart</li>
          </ul>
          {products.length > 0 ? (
            products.map((item, index) => {
              return (
                <ul key={item._id}>
                  {/* <li>{index + 1}</li> */}
                  {/* <li>
                <img
                  src={item.icon}
                  alt=""
                  // style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  style={{
                    width: "5rem",
                    height: "2rem",
                    filter: "drop-shadow(0rem 0.2rem 0.5rem #f1f7ff)",
                    borderRadius: "0.4rem",
                  }}
                />
              </li> */}
                  <li>{item.name}</li>
                  <li>{item.company}</li>
                  <li>{item.price} ₹</li>
                  <li>{item.category}</li>
                  <li>
                    <button className="update-btn">
                      <Link className="update-btn" to={`/update/${item._id}`}>
                        Update
                      </Link>
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => {
                        handleDeleteProduct(item._id);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                  <li>
                    <div className="add-minus-quantity">
                      <button
                        onClick={() => {
                          handleRemoveFromCart(item);
                          handleDecrementQuantity(item._id);
                        }}
                      >
                        <i className="fas fa-minus minus"></i>
                      </button>
                      <input
                        type="text"
                        placeholder="0"
                        value={productQuantities[item._id] || 0}
                        disabled
                      />
                      <button
                        onClick={() => {
                          handleAddToCart(item);
                          handleIncrementQuantity(item._id);
                        }}
                      >
                        <i className="fas fa-plus add"></i>
                      </button>
                    </div>
                  </li>
                </ul>
              );
            })
          ) : (
            <h3>No products available..!</h3>
          )}
        </div>
      </div>
      <div className="card-total">
        <p>
          {/* cart total: <span> {25000} ₹ </span> */}
          <button
            onClick={() => {
              navigate("/cart");
            }}
          >
            CheckOut
          </button>
        </p>
        {/* <button>CheckOut</button> */}
      </div>
    </div>
  );
};

export default ProductList;
