import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useNavigate } from "react-router-dom";

const CartDetails = () => {
  const BASE_URL = process.env.REACT_APP_YOUR_BASE_URL;
  const [cartData, setCartData] = useState({
    totalItems: 0,
    totalPrice: 0,
    items: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    getCartDetails();
  }, []);

  const handleAddToCart = async (product) => {
    try {
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
        // setCartTotal(response.data.totalPrice);
        alert("Product added to cart");
        getCartDetails();
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
        body: JSON.stringify({ productId, totalPrice, quantity: 1 }),
      });
      response = await response.json();
      if (response.data.items) {
        alert("Product removed from cart");
        getCartDetails();
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const getCartDetails = async () => {
    try {
      let response = await fetch(`${BASE_URL}/cart`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      response = await response.json();
      if (response.status != null) {
        let items = 0;
        response.data.items.forEach((element) => {
          items += element.quantity;
        });
        setCartData({
          totalItems: items,
          totalPrice: response.data.totalPrice,
          items: response.data.items,
        });
        // setCartData({
        //   totalPrice: response.data.totalPrice,
        // });
        // setCartData({
        //   items: response.data.items,
        // });
      } else {
        // console.log("cart details:", response);
        // alert("An error occurred while fetching cart details.");
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  return (
    <div className="cart-details">
      <h2>Cart Details</h2>

      <button className="back-button" onClick={() => navigate("/")}>
        Back
      </button>

      <Scrollbars style={{ width: 525, height: 350 }}>
        <ul>
          {cartData.items.length > 0 ? (
            cartData.items.map((item, index) => (
              <li key={index}>
                <div className="item-details">
                  {/* <img src={item.image} alt={item.name} /> */}
                  <div className="item-info">
                    <h3>{item.product.name}</h3>
                    <p>Price: {item.product.price} ₹</p>
                    <p>Category: {item.product.category}</p>
                    <p>Company: {item.product.company}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>
                        Subtotal: {item.product.price * item.quantity} ₹
                      </span>
                    </p>
                    <div className="cart-details-add-minus">
                      <p>
                        <div>
                          <button
                            onClick={() => handleRemoveFromCart(item.product)}
                          >
                            {/* <i className="fas fa-minus minus"></i> */}
                            <i className="fas fa-trash-alt delete-icon"></i>
                          </button>
                          <input type="text" placeholder="6" disabled />
                          <button onClick={() => handleAddToCart(item.product)}>
                            <i className="fas fa-plus add add-icon"></i>
                          </button>
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <h3>Your Cart is empty..!</h3>
          )}
        </ul>
      </Scrollbars>

      <div className="cart-total">
        <p>Cart Total: {cartData.totalPrice} ₹</p>
        <p id="total_items">Total Items: {cartData.totalItems}</p>
      </div>
    </div>
  );
};

export default CartDetails;
