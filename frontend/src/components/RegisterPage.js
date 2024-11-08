import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        // Reset messages
        setError('');
        setSuccess('');

        // Validate that passwords match
        if (password !== repassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                email,
                password,
            });

            // Handle successful registration
            if (response.status === 201) {
                setSuccess('Registration successful! Please log in.');
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-body">
            <div className="register-container">
                <h2 className="register-header">Register - Ideation For All</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        className="register-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        className="register-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="register-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="register-input"
                        placeholder="Re-type Password"
                        value={repassword}
                        onChange={(e) => setRepassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="register-button">Create Account</button>
                </form>

                {error && <p className="error-message">{error}</p>}
                {success && (
                    <p className="success-message">
                        {success} <Link to="/login">Log in</Link>.
                    </p>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
