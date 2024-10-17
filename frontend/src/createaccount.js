import React, {userState} from 'react'

const CreateAccount = () => {
  const [username, setUsername] = 
useState(");
 const [message, setMessage] = useState(");

const handleCreateAccount = async () => {
 try {
   const response = await
fetch('http://localhost:3000/api/api/auth/register',{
       method: 'POST',
       headers: {
       'Content-Type':'application/json',
	   },
       body: JSON.stringify({ username, password, email}),
        });

        if(response.ok){
           setMessage('Account created successfully!");
		} else{
           const errorData = await response.json();
           setMessage(Error: ${errorData.message});
		}
 }catch(error){
  setMessage('An error occurred. Please try again.');
 }
};

return(
<div>
  <h2>Create Account</h2>
   <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) =>
    setUsername(e.target.value)}
    />
    <button onClick={handleCreateAccount}
     >Create Account</button>
	 {message && <p>{message}</p>}
     </div>
     );
};

export default CreateAccount;	 