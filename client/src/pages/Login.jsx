import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Signup from "./Signup.jsx";
import api from "../api/axios.js";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      // extract token and store
      const token = response.data.token;
      localStorage.setItem("access_token", token);

      // redirect
      navigate("/dashboard");
    } catch (err) {
      setError(err.response.data.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      <p>
        New User? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
