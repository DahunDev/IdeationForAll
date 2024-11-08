import React, { useState } from "react";
import { auth } from "../configs/firebaseConfig";
import { browserSessionPersistence, getAuth, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./loginPage.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        document.getElementById("login-fail").style.display = "none";
                        navigate("/workspace");
                    })
                    .catch((signInError) => {
                        handleSignInError(signInError);
                    });
            })
            .catch((setPersistenceError) => {
                handlePersistenceError(setPersistenceError);
            });
    };

    const handleSignInError = (error) => {
        const errorCode = error.code;
        let errorMessage = "Error occurred. Try again.";
        
        if (errorCode === "auth/invalid-email") {
            errorMessage = "Invalid email.";
        } else if (errorCode === "auth/invalid-credential") {
            errorMessage = "Incorrect email or password.";
        }

        document.getElementById("login-fail-message").innerText = errorMessage;
        document.getElementById("login-fail").style.display = "block";
    };

    const handlePersistenceError = (error) => {
        console.error("Error setting persistence:", error);
        document.getElementById("login-fail-message").innerText = "Error setting persistence. Try again.";
        document.getElementById("login-fail").style.display = "block";
    };

    return (
        <div className="login-body">
            <div className="login-container">
                <h2 className="login-header">Login - Ideation For All</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                    <div className="goto-links">
                        <a
                            className="goto-link-item"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                resetPassword(email);
                            }}
                        >
                            Forgot Username/Password?
                        </a>
                        <a className="goto-link-item" href="/register">Register New Account</a>
                    </div>
                    <div id="login-fail">
                        <p id="login-fail-message"></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Reset Password Function
export const resetPassword = (email) => {
    const auth = getAuth();
    if (!email || email.length === 0) {
        alert("To reset password, please enter an email address.");
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Check your email.");
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/missing-email") {
                alert("Please enter an email address.");
            } else if (errorCode === "auth/invalid-email") {
                alert("Entered email address is invalid.");
            } else {
                alert("Error: " + errorCode);
            }
        });
};

export default LoginPage;
