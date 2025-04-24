import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getBackendUrl } from "../configs/serverSettings";
import axios from "axios";
import { auth } from "../configs/firebaseConfig";
import "./editAccountPage.css";

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
            alert(response.data.message || "Username updated successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update username");
        }
    };

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        try {
            const backendUrl = getBackendUrl();
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
            alert(
                response.data.message ||
                "Email updated. Due to security policy, please sign in again."
            );
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update email");
        }
    };

    return (
        <div className="edit-body">
            <div className="toolbar-container">
                <div className="head-container">
                    <h1 className="name-header">Ideation for All</h1>
                    <button
                        className="account-button"
                        onClick={() => navigate("/workspace")}
                    >
                        Workspace
                    </button>
                </div>
                <div className="workspace-container">
                    <div className="edit-section">
                        <h2>Update Username</h2>
                        <form onSubmit={handleUpdateUsername}>
                            <input
                                type="text"
                                placeholder="New Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <button type="submit">Update Username</button>
                        </form>

                        <h2>Change Email</h2>
                        <form onSubmit={handleChangeEmail}>
                            <input
                                type="email"
                                placeholder="New Email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Change Email</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAccountPage;


