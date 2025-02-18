// src/TestPage.js
import React, { useState, useEffect } from "react";
import { auth } from "../configs/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const TestPage = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserId("Not logged in");
      } else {
        console.log(user);
        setUserId(user.uid);
        const idToken = await user.getIdToken(); // Get Firebase ID token
        setToken(idToken); // Set token in state
      }
    });
  }, [navigate]);

  return (
    <div>
      <h1>Test API Page</h1>
      {/* <button onClick={handleLogin}>Login and Get Token</button> */}
      <p>token: {token}</p>
      <p>uid: {userId}</p>
    </div>
  );
};

export default TestPage;
