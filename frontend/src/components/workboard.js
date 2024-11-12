import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./workboard.css";
import PostIt from "./functions/PostIts";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Workboard = () => {
  const [postits, setPostits] = useState([]);
  const [username, setUsername] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login"); // Redirect to login if not logged in
      } else {
        console.log(user);
        try {
          const userDoc = doc(db, "Users", user.uid); // Reference to the user document
          const userSnapshot = await getDoc(userDoc); // Fetch the document

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUsername(userData.username); // Set the username state
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
  }, [navigate]);

  const accountPageNav = () => {
    navigate("/edit-account"); // TO DO: Change Navigate link to edit account page once fully functional
  };

  const addNote = () => {
    setPostits([
      ...postits,
      {
        id: Date.now(),
      },
    ]);
  };

  const deletePostit = (postitId) => {
    setPostits(postits.filter((item) => item.id !== postitId));
  };

  return (
    <html lang="en">
      <body class="board_body">
        <div class="toolbar_container">
          <div class="head_container">
            <input class="titletext" placeholder="Title:"></input>
            <h1 class="name_header">Ideation for All</h1>
            <button class="account_button" onClick={accountPageNav}>
              {username || "Account"}
            </button>
          </div>
          <div class="options_container">
            <button class="save_or_share_button">Save...</button>
            <button class="save_or_share_button">Share</button>
          </div>
          <div class="workspace_container">
            <button class="workspace_button" onClick={addNote}>
              Create new post-it
            </button>
            <button class="workspace_button">Create vote</button>
            <button class="workspace_button">Groups</button>
            <button class="workspace_button">People: 1</button>
          </div>
          {postits.map((item) => (
            <PostIt key={item.id} onClose={() => deletePostit(item.id)} />
          ))}
        </div>
      </body>
    </html>
  );
};
export default Workboard;
