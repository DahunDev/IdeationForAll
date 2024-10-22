import React, { useState } from "react";
import { auth } from "../configs/firebaseConfig";
import { browserSessionPersistence, getAuth, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";
import "./loginPage.css"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // Proceed to sign in after setting persistence
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in
   
        const user = userCredential.user;
        document.getElementById("login-fail").style.display = "none";
        Navigate("/workspace");

      }).catch((signInError) => {
        // Handle other errors that may occur during signInWithEmailAndPassword
        const errorCode = signInError.code;

        console.log(errorCode);
    
        if (errorCode === "auth/invalid-email") {
          document.getElementById("login-fail-message").innerText = "Invalid email.";
          document.getElementById("login-fail").style.display = "block";
        } else if (errorCode === "auth/invalid-credential") {
          document.getElementById("login-fail-message").innerText = "Failed to login, make sure email and password are correct";
          document.getElementById("login-fail").style.display = "block";
        } else {
          document.getElementById("login-fail-message").innerText = "Error occurred. Try again.";
          document.getElementById("login-fail").style.display = "block";
          console.log("Error occurred. Try again.");
          console.log(`${errorCode}`);
        }
      })
    }).catch((setPersistenceError) => {
      // Handle errors from setPersistence
      console.error("Error setting persistence:", setPersistenceError);
    
      // You may want to provide feedback to the user or take appropriate action.
      document.getElementById("login-fail-message").innerText = "Error setting persistence. Try again.";
      document.getElementById("login-fail").style.display = "block";
    });
  };

  return (
    <div>
      <h2>Login - Ideation For All</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <aside className="goto-forget-password">
        <a 
          className="goto-login-item" 
          id="resetPW-button2" 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            resetPassword(email);
          }}
          style={{ marginRight: '15px' }} // Add space between the two links
        >
          Forgot Username/Password?
        </a>
        <a href="/register">Register New Account</a>
      </aside>


        <div id="login-fail">
          <p id="login-fail-message"></p>
        </div>     
      </form>
    </div>
  );
};





export const resetPassword = (email) => {
  const auth = getAuth();
  
  if(!email || email.length === 0) {
    alert("To reset password, must need to enter email address.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent, check the email to reset your password.");

      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    if(errorCode === "auth/missing-email"){
      alert("To reset password, must enter email address.");
      return;
    }  

    if(errorCode === "auth/invalid-email"){
      alert("Entered email address is invalid.");
      return;
    }

    alert(errorCode);

  
    });
  }
export default LoginPage;


