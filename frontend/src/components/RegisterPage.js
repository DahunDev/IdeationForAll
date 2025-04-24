import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getBackendUrl } from "../configs/serverSettings";
import classes from "./loginPage.module.css"; // reuse login styles

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
            const response = await axios.post(`${backendUrl}/api/auth/register`, {
                username,
                email,
                password,
            });

            if (response.status === 201) {
                setSuccess("Registration successful! Please log in.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className={classes.board_body}>
            <div className={classes.toolbar_container}>
                <div className={classes.head_container}>
                    <h1 className={classes.name_header}>Ideation for All</h1>
                    <button
                        className={classes.account_button}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>
                <div className={classes.workspace_container}>
                    <div className={classes.login_section}>
                        <h2>Register</h2>
                        <form onSubmit={handleRegister}>
                            <input
                                type="email"
                                className={classes.titletext}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className={classes.titletext}
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className={classes.titletext}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className={classes.titletext}
                                placeholder="Re-type Password"
                                value={repassword}
                                onChange={(e) => setRepassword(e.target.value)}
                                required
                            />
                            <button type="submit" className={classes.workspace_button}>
                                Create Account
                            </button>
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
        </div>
    );
};

export default RegisterPage;
