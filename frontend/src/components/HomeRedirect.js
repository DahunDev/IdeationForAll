import {
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
  } from "firebase/auth";
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  
  function HomeRedirect() {
    const navigate = useNavigate();
    const auth = getAuth();
  
    useEffect(() => {
      // Check if the user is already logged in
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Redirect to dashboard or home page if user is logged in
          navigate("/workspace");
        }else{
          navigate("/login");
        }
      });
    }, [auth, navigate]);
    return (
      <div style={styles.body}>
        <div style={styles.container}>
          <h1>Loading Ideation For All</h1>
        </div>
      </div>
    );
  }
  
  const styles = {
    body: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      margin: 0,
      fontFamily: "Arial, sans-serif",
    },
    container: {
      textAlign: "center",
    },
  };
  
  export default HomeRedirect;
  