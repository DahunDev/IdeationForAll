import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  
  const handleLogin = (e) => {
	  e.preventDefault();
  }
  
  return (
  <div>
  <h2>Login - Ideation For All</h2>
  <form onSubmit={handleLogin)>
     <input
	   type="text"
	   placeholder="Email"
	   value={email}
	   onChange={(e) => setEmail(e.target.value)}
	   required
	   />
	   <input
	   type="text"
	   placeholder="Password"
	   value={password}
	   onChange={(e) => setPassword(e.target.value)}
	   required
	   />
	   <button type="submit">Login</button>
	 </form>
   </div>
   );
  };
  export default Login;
	   
	   