import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signup");
  };

  return (
    <>
      <h2 id="nav-title" onClick={() => navigate("/")}>
        P r o d u c t H u b
      </h2>
      {auth ? (
        <ul className="nav-list">
          <li>
            <Link to="/">Products</Link>
          </li>

          <li>
            <Link to="/add">Add Product</Link>
          </li>

          {/* <li>
            <div className="cart-icon">
              <Link to="/cart">
                <img src="../images/cart.png" alt="cart" />
              </Link>
              <p>{0}</p>
            </div>
          </li> */}

          <li>
            <Link onClick={handleLogout} to="/signup">
              Logout ({JSON.parse(auth).name})
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="nav-list">
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      )}
    </>
  );
};

export default Nav;
