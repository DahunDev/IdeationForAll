// EditAccount.js
import React, { useEffect, useState } from "react";
import "./editAccountPage.css";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getBackendUrl } from "../configs/serverSettings";
import axios from "axios";
import { auth } from "../configs/firebaseConfig";

const EditAccountPage = () => {
  const [username, setUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and get token
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userToken = await user.getIdToken();
        setToken(userToken);
      } else {
        navigate("/login"); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [navigate]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = getBackendUrl();
      if (!backendUrl) {
        throw new Error(
          "Backend URL is not set. Make sure server settings are loaded.",
        );
      }

      // console.log("call rest api to update updateUsername");
      const response = await axios.put(
        `${backendUrl}/api/user/updateUsername`,
        { username },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log("Full response:", response);

      alert(response.data.message || "username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
      alert(error.response?.data?.message || "Failed to update username");
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = getBackendUrl();
      if (!backendUrl) {
        throw new Error(
          "Backend URL is not set. Make sure server settings are loaded.",
        );
      }

      // console.log("call rest api to update email");
      const response = await axios.put(
        `${backendUrl}/api/user/updateEmail`,
        { newEmail },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log("Full response:", response);
          // Refresh token after updating email
      alert(response.data.message || "Email updated successfully. Due to secruity policy, need to sign in again!");
    } catch (error) {
      console.error("Error updating email:", error);
      alert(error.response?.data?.message || "Failed to update email");
    }
  };

  return (
    <div className="container">
      <h1>Ideation For All</h1>

      <div className="section">
        <h2>Update Name</h2>
        <form onSubmit={handleUpdateUsername}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Update Username</button>
        </form>
      </div>

      <div className="section">
        <h2>Change Email</h2>
        <form onSubmit={handleChangeEmail}>
          <input
            type="email"
            placeholder="New Email Address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <button type="submit">Change Email</button>
        </form>
      </div>
    </div>
  );
};

export default EditAccountPage;
