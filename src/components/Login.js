import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const BASE_URL = process.env.REACT_APP_YOUR_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  const handleLoginData = async () => {
    try {
      let response = await fetch(`${BASE_URL}/users/login`, {
        method: "post",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      response = await response.json();
      // console.log("login response", response);
      if (response.status === true) {
        localStorage.setItem("token", JSON.stringify(response.token));
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success("Logged in successfully..!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Invalid Email OR Password..!");
      }
    } catch (error) {
      toast.error("An error occurred while login. Please try again.");
      return error;
    }
  };

  return (
    <div className="login">
      <h1 className="form-title">Login</h1>
      <ToastContainer />

      <input
        className="input-box"
        type="text"
        id="name"
        value={email}
        required="required"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Enter your Email"
        autoComplete="off"
      />

      <input
        className="input-box"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="Enter your Password"
        autoComplete="off"
        required
      />

      <button className="app-button" type="button" onClick={handleLoginData}>
        Login
      </button>
    </div>
  );
};

export default Login;
