import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import { getBackendUrl } from "../configs/serverSettings";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (password !== repassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const backendUrl = getBackendUrl();
            if (!backendUrl) {
                throw new Error("Backend URL is not set. Make sure server settings are loaded.");
            }

            const response = await axios.post(`${backendUrl}/api/auth/register`, {
                username,
                email,
                password,
            });

            if (response.status === 201) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
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
                    <div className="register_section">
                        <h2>Create Account</h2>
                        <form onSubmit={handleRegister}>
                            <input
                                type="email"
                                className="titletext"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="titletext"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className="titletext"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className="titletext"
                                placeholder="Re-type Password"
                                value={repassword}
                                onChange={(e) => setRepassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="workspace_button">Create Account</button>
                        </form>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        {success && (
                            <p style={{ color: "green" }}>
                                {success} <Link to="/login">Log in</Link>.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </body>
    );
};

export default RegisterPage;
