import React, { useState } from "react";
import "./createAccount.css";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        setMessage("Account created successfully!");
        setTimeout(() => navigate("/workspace"), 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <body className="board_body">
      <div className="toolbar_container">
        <div className="head_container">
          <h1 className="name_header">Ideation for All</h1>
          <button className="account_button" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
        <div className="workspace_container">
          <div className="create_account_section">
            <h2>Create Account</h2>
            <input
              type="text"
              className="titletext"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              className="titletext"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="titletext"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="workspace_button" onClick={handleCreateAccount}>
              Create Account
            </button>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </body>
  );
};

export default CreateAccount;
