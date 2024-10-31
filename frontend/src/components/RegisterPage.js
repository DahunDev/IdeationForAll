import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import { Link, Navigate } from "react-router-dom";
import { getBackendUrl } from "../configs/serverSettings";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Reset messages
    setError("");
    setSuccess("");

    // Validate that passwords match
    if (password !== repassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const backendUrl = getBackendUrl();
      if (!backendUrl) {
        throw new Error(
          "Backend URL is not set. Make sure server settings are loaded.",
        );
      }

      const response = await axios.post(`${backendUrl}/api/auth/register`, {
        username,
        email,
        password,
      });

      // Handle successful registration
      if (response.status === 201) {
        setSuccess("Registration successful! Please log in.");
        Navigate("/login");
      }
    } catch (err) {
      // Handle error response
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="container">
      <h1>Ideation For All</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          name="repassword"
          placeholder="Re-type Password"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
          required
        />
        <button type="submit">Create Account</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Update the success message to include the link to the login page */}
      {success && (
        <p style={{ color: "green" }}>
          {success} <Link to="/login">Log in</Link>.
        </p>
      )}
    </div>
  );
};

export default RegisterPage;
