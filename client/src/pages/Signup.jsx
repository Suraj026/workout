import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios.js";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/signup", {
        username,
        email,
        password,
      });

      // if login successful
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message || "Signup failed");
    }
  };

  return (
    <>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Sign Up</button>
      </form>

      {error && <p>{error}</p>}

      <p>
        Already have an account ? <Link to="/login">Login</Link>
      </p>
    </>
  );
};

export default Signup;
