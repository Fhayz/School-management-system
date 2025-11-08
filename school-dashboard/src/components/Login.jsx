import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8001/api/v1/auth/login"; // Adjust endpoint as needed

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(API_URL, { email, password }); // <<<< field names must match!
      //WHEN LOGIN IS SUCCESSFUL
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("role", res.data.role); //store role!
        onLogin(res.data.access_token, res.data.role); //notify App.jsx, pass role
       
      } else {
        setError("Login failed: No token provided");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <label>Email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} required />
      <label>Password</label>
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
