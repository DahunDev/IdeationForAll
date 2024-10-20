import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const userId = searchParams.get('id');
  const token = searchParams.get('token');

  const [message, setMessage] = useState('');

  const handlePassword = async (e) => {
    e.preventDefault();
    const info = new FormData(e.currentTarget); 
    const updatedPassword = info.get('newpassword'); 
    const retypePassword = info.get('confirmpassword');

    if (updatedPassword !== retypePassword) {
      setMessage('Passwords do not match!');
    } else {
      try {
        const url = process.env.REACT_APP_BACKEND_URL + '/api/resetPassword';
        const res = await axios.post(url, {
          password: updatedPassword,
          token: token,
          userId: userId,
        });
        if (res.data.success === false) {
          setMessage('An error has occurred. Please try again.');
        } else {
          setMessage('Success');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error) {
        setMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handlePassword}> 
        <div>
          <label htmlFor="newpassword">New Password</label>
          <input
            type="password"
            id="newpassword"
            name="newpassword"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmpassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmpassword"  
            name="confirmpassword"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ResetPassword;
