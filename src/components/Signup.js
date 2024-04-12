import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const BASE_URL = process.env.REACT_APP_YOUR_BASE_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  const handleSignupData = async () => {
    try {
      let response = await fetch(`${BASE_URL}/users/signup`, {
        method: "post",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      response = await response.json();
      if (response) {
        localStorage.setItem("token", JSON.stringify(response.token));
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success("Welcome, You have registered successfully..!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("An error occurred while signup. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while signup. Please try again.");
      return error;
    }
  };

  return (
    <div className="register">
      <h1 className="form-title">Register</h1>
      <ToastContainer />
      <input
        className="input-box"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="Enter your Name"
        autoComplete="off"
        required
      />

      <input
        className="input-box"
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Enter your Email"
        autoComplete="off"
        required
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

      <button className="app-button" type="button" onClick={handleSignupData}>
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
