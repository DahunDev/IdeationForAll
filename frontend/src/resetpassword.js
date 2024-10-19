import React, {userState} from 'react'
import {
useSearchParams, useNavigate} from "react-router-dom";
import axios from "axios"

const ResetPassword = () => {
	const [searchParams] = useSearchParams();
	let navigate = useNavigate();
	const userId = searchParams.get("id");
	const token = searchParams.get("token");
	
	 const handlePassword = async (e) => {
		 e.preventDefault();
		 const info = new formData(e.currentTarget);
		 const updatedPassword = data.get("updatedPassword");
		 const retypePassword = data.get("retypePassword");
		 
		 if(updatedPassword !== retypePassword)
			 setMessage("Passwords do not match!");
		     
	 
	 else{
		 const url = process.env.REACT_APP_BACKEND_URL + "/api/resetPassword";
		 const res = await.axios.post(url, {password: updatedPassword, token: token, userId: userId,
		 });
		 if(res.data.success === false){
			 setMessage("An error has occurred. Please try again");
		 } else{
		 setMessage("Success");}
		 setTimeout(() => {navigate("/login");
		 }, 2000);
	 }
	 }
};

return(

);

export default ResetPassword;