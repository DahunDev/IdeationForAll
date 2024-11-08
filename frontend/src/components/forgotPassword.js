import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        // Check if the user is already logged in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Redirect to dashboard or home page if user is logged in
                navigate('/workspace');
            }
        });
    }, [auth, navigate]);


    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic for sending the recovery email can be added here.
        resetPassword(email);
    };

    const resetPassword = (email) => {
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

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <h1>Ideation For All</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />

                    <button type="submit" style={styles.button}>
                        Send Recovery Email
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    body: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0,
        fontFamily: 'Arial, sans-serif'
    },
    container: {
        textAlign: 'center'
    },
    input: {
        display: 'block',
        margin: '10px auto',
        padding: '10px',
        width: '80%'
    },
    button: {
        display: 'block',
        margin: '10px auto',
        padding: '10px',
        width: '80%'
    }
};

export default ForgotPassword;
