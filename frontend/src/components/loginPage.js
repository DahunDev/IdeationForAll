import React, { useEffect, useState } from "react";
import { auth } from "../configs/firebaseConfig";
import {
    browserSessionPersistence,
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./loginPage.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/workspace");
            }
        });
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await setPersistence(auth, browserSessionPersistence);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential && userCredential.user) {
                navigate("/workspace");
            }
        } catch (error) {
            setError("Login failed. Please check your email and password.");
        }
    };

    return (
        <body className="board_body">
            <div className="toolbar_container">
                <div className="head_container">
                    <h1 className="name_header">Ideation for All</h1>
                    <button className="account_button" onClick={() => navigate("/register")}>
                        Register
                    </button>
                </div>
                <div className="workspace_container">
                    <div className="login_section">
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                className="titletext"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            <button type="submit" className="workspace_button">Login</button>
                        </form>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <aside className="goto-forget-password">
                            <a href="#" onClick={(e) => { e.preventDefault(); resetPassword(email); }}>Forgot Password?</a>
                            <a href="/register">Register New Account</a>
                        </aside>
                    </div>
                </div>
            </div>
        </body>
    );
};

export const resetPassword = (email) => {
    const auth = getAuth();
    if (!email) {
        alert("To reset password, enter an email address.");
        return;
    }
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Check your inbox.");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
};

export default LoginPage;
