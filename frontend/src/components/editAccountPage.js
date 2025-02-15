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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userToken = await user.getIdToken();
                setToken(userToken);
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        try {
            const backendUrl = getBackendUrl();
            if (!backendUrl) {
                throw new Error("Backend URL is not set. Make sure server settings are loaded.");
            }

            const response = await axios.put(
                `${backendUrl}/api/user/updateUsername`,
                { username },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message || "Username updated successfully!");
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
                throw new Error("Backend URL is not set. Make sure server settings are loaded.");
            }

            const response = await axios.put(
                `${backendUrl}/api/user/updateEmail`,
                { newEmail },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(
                response.data.message || "Email updated successfully. Due to security policy, you need to sign in again!"
            );
        } catch (error) {
            console.error("Error updating email:", error);
            alert(error.response?.data?.message || "Failed to update email");
        }
    };

    return (
        <body className="board_body">
            <div className="toolbar_container">
                <div className="head_container">
                    <h1 className="name_header">Ideation for All</h1>
                    <button className="account_button" onClick={() => navigate("/workspace")}>
                        Back to Workspace
                    </button>
                </div>
                <div className="workspace_container">
                    <div className="edit_account_section">
                        <h2>Update Name</h2>
                        <form onSubmit={handleUpdateUsername}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="titletext"
                            />
                            <button type="submit" className="workspace_button">Update Username</button>
                        </form>
                    </div>
                    <div className="edit_account_section">
                        <h2>Change Email</h2>
                        <form onSubmit={handleChangeEmail}>
                            <input
                                type="email"
                                placeholder="New Email Address"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                                className="titletext"
                            />
                            <button type="submit" className="workspace_button">Change Email</button>
                        </form>
                    </div>
                </div>
            </div>
        </body>
    );
};

export default EditAccountPage;
