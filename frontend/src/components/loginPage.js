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
import { Navigate, useNavigate } from "react-router-dom";
import classes from "./loginPage.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [prompted, setPrompted] = useState(false); // Track if prompt has been shown
  const [error, setError] = useState("");

  const [isLoggingIn, setIsLoggingIn] = useState(false); // Flag to check if user is logging in
  const [LoggedInByManually, setLoggedInByManually] = useState(false); // Flag to check if user is logging in
  const [isFirst, setIsFirst] = useState(true); // Use state to track if it's the first time checking auth

  useEffect(() => {
    const checkAuth = onAuthStateChanged(auth, (user) => {
      setIsFirst(false);
      if (user && isFirst) {
        // User is logged in
        const confirmLogout = window.confirm(
          "You are already logged in. Do you want to log out?",
        );
        setPrompted(true); // Mark as prompted to avoid infinite loop
        if (confirmLogout) {
          // User chose to log out
          signOut(auth)
            .then(() => {
              console.log("User logged out successfully.");
              setPrompted(false); // Reset prompted after logout to allow prompt on next login
              // Optional: Redirect to the login page or show a message
            })
            .catch((error) => {
              console.error("Error logging out:", error);
            });
        } else {
          // User chose to stay logged in
          console.log("User chose to stay logged in.");
          setPrompted(true);
          navigate("/workspace"); // Redirect to workspace or dashboard
        }
      } else {
        // No user is logged in
        console.log("No user is logged in.");
      }
    });
    return () => checkAuth();
  }, [auth, navigate, prompted, isFirst]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Set logging in flag to true

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            if (userCredential && userCredential.user) {
              setPrompted(true);
              setLoggedInByManually(true);
              const user = userCredential.user;
              // document.getElementById("login-fail").style.display = "none";
              navigate("/workspace");
            } else {
              // Handle case where userCredential or user is missing
              console.error(
                "Unexpected login failure, no user credential returned.",
              );
              setError("Login failed. Please try again.");
              // document.getElementById("login-fail-message").innerText =
              //   "Login failed. Please try again.";
              // document.getElementById("login-fail").style.display = "block";
            }
          })
          .catch((signInError) => {
            const errorCode = signInError?.code || "unknown-error";
            console.log("Error Code:", errorCode);

            if (errorCode === "auth/invalid-email") {
              // document.getElementById("login-fail-message").innerText =
              //   "Invalid email.";
              setError("Invalid email.");
            } else if (errorCode === "auth/invalid-credential") {
              setError(
                "Failed to login, make sure email and password are correct.",
              );

              // document.getElementById("login-fail-message").innerText =
              //   "Failed to login, make sure email and password are correct.";
            } else {
              setError("Error occurred. Try again.");
              // document.getElementById("login-fail-message").innerText =
              //   "Error occurred. Try again.";
            }
            // document.getElementById("login-fail").style.display = "block";
          });
      })
      .catch((setPersistenceError) => {
        console.log("Persistence error:", setPersistenceError);
        const errorCode =
          setPersistenceError?.code || "unknown-persistence-error";
        setError("Error setting persistence. Try again.");
        // document.getElementById("login-fail-message").innerText =
        //   "Error setting persistence. Try again.";
        // document.getElementById("login-fail").style.display = "block";
        console.log("Error Code:", errorCode);
      })
      .finally(() => {
        setIsLoggingIn(false); // Reset logging in flag
      });
  };

  return (
    <body className={classes.board_body}>
      <div className={classes.toolbar_container}>
        <div className={classes.head_container}>
          <h1 className={classes.name_header}>Ideation for All</h1>
          <button
            className={classes.account_button}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
        <div className={classes.workspace_container}>
          <div className={classes.login_section}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                className={classes.titletext}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <button type="submit" className={classes.workspace_button}>
                Login
              </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <aside className={classes["goto-forget-password"]}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  resetPassword(email);
                }}
              >
                Forgot Password?
              </a>
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

  if (!email || email.length === 0) {
    alert("To reset password, must need to enter email address.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert(
        "Password reset email sent, check the email to reset your password.",
      );

      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      // const errorMessage = error.message;
      if (errorCode === "auth/missing-email") {
        alert("To reset password, must enter email address.");
        return;
      }

      if (errorCode === "auth/invalid-email") {
        alert("Entered email address is invalid.");
        return;
      }

      alert(errorCode);
    });
};
export default LoginPage;
