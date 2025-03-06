import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./workboard.css";
import PostIt from "./functions/PostIts";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getBackendUrl } from "../configs/serverSettings";
import { connectWebSocket } from "../utils/websocket";

const Workboard = () => {
  const [postits, setPostits] = useState([]);
  const [username, setUsername] = useState();
  const [userToken, setUserToken] = useState();
  const [boardTitle, setBoardTitle] = useState();
  const [ungroupedPostIts, setUngroupedPostIts] = useState([]);
  const [boards, setBoards] = useState([]); // List of boards

  const navigate = useNavigate();
  const { boardId } = useParams();

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
            const token = await user.getIdToken();
            setUserToken(token);

            if (!boardId) {
              fetchUserBoards(token); // Fetch list of boards if no boardId is in the URL
            }

                      // Now that the backend URL is set, connect WebSocket
            if (getBackendUrl()) {
              connectWebSocket(getBackendUrl()); // Make sure backendUrl is valid
            } else {
              console.error("No backend URL set.");
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate, boardId]);

  // Fetch board data
  useEffect(() => {
    if (userToken && boardId) {
      fetchBoardData(boardId);
    }
  }, [userToken, boardId]);

  const fetchBoardData = async (boardId) => {
    try {
      const backendUrl = getBackendUrl();

      const response = await fetch(
        `${backendUrl}/api/board/getBoard?boardId=${encodeURIComponent(boardId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (response.ok) {
        const boardData = await response.json();
        console.log(boardData);
        setBoardTitle(boardData.name || "Untitled Board");
        setPostits(boardData.UngroupedPostIts || []);
        setUngroupedPostIts(boardData.UngroupedPostIts || []);
      } else {
        console.error("Failed to fetch board data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching board data:", error);
    }
  };

  const fetchUserBoards = async (token) => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/board/getBoardList`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBoards(data.boards || []);
        // console.log(data.boards);
      } else {
        console.error("Failed to fetch boards:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const createNewBoard = async (boardName) => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/board/createBoard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ boardName: boardName }),
      });

      if (response.ok) {
        const newBoard = await response.json();
        navigate(`/workspace/${newBoard.boardId}`); // Redirect to the new board
      } else {
        const errorData = await response.json();

        alert(`Failed to create new board: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating new board:", error);
    }
  };

  const createNewGroup = async (groupName) => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/board/createGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ boardId: boardId || Date.now(), groupName }),
      });

      if (response.ok) {
        const newBoard = await response.json();
        setBoardTitle(newBoard.groupName);
        setPostits([]);
      } else {
        console.error("Failed to create new board:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating new board:", error);
    }
  };

  const accountPageNav = () => {
    navigate("/edit-account"); // TO DO: Change Navigate link to edit account page once fully functional
  };

  const addNote = async () => {
    try {
      const response = await fetch(
        `${getBackendUrl()}/api/postit/createPostIt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ name: "New Post-It", boardId }),
        },
      );

      if (response.ok) {
        const newPostIt = await response.json();
        setPostits((prevPostits) => [
          ...prevPostits,
          { id: newPostIt.postItId, name: "New Post-It" },
        ]);
      } else {
        alert(`Failed to create post-it:, ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating post-it:", error);
    }
  };

  const deletePostit = async (postItId) => {
    try {
      // Make API call to delete the post-it
      const response = await fetch(
        `${getBackendUrl()}/api/postit/deletePostIt`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`, // Assuming userToken is stored in state or context
          },
          body: JSON.stringify({ postItId }),
        },
      );
      // console.log("Deleting PostIt with ID:", postItId, `Bearer ${userToken}`); // Log the ID being sent

      if (response.ok) {
        // If the API call was successful, update the state
        setPostits((prevPostits) => {
          const updatedPostIts = prevPostits.filter(
            (item) => item.postItId !== postItId,
          );
          // console.log("After update", updatedPostIts);
          return updatedPostIts;
        });
      } else {
        console.error("Failed to delete post-it:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting post-it:", error);
    }
  };

  return (
    <body className="board_body">
      <div className="toolbar_container">
        <div className="head_container">
          {boardId ? (
            <>
              <input
                className="titletext"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                placeholder="Title:"
              />
              <h1 className="name_header">Ideation for All</h1>
            </>
          ) : (
            <>
              <h1 className="name_header">Your Boards</h1>
              <button
                className="workspace_button"
                onClick={async () => {
                  const boardName = prompt("Enter board name:");
                  if (boardName) {
                    await createNewBoard(boardName);
                  }
                }}
              >
                Create Board
              </button>{" "}
            </>
          )}
          <button
            className="account_button"
            onClick={() => navigate("/edit-account")}
          >
            {username || "Account"}
          </button>
        </div>
        <div className="workspace_container">
          {boardId ? (
            <>
              <button className="workspace_button">Create vote</button>
              <button className="workspace_button">Groups</button>
              <button className="workspace_button">People: 1</button>
              <button
                className="workspace_button"
                onClick={() => navigate("/workspace")}
              >
                Go to Workspace Home
              </button>
              {postits.map((item) => (
                <PostIt
                  postItId={item.postItId}
                  boardID={item.boardID}
                  name={item.name}
                  userID={item.userID}
                  idToken={userToken}
                  content={item.content || ""}
                  groupID={item.groupID}
                  imageLink={item.imageLink}
                  font={item.font}
                  position={item.position}
                  size={item.size}
                  onClose={() => deletePostit(item.postItId)}
                />
              ))}
            </>
          ) : (
            <ul className="board-list">
              {boards.map((board) => (
                <li key={board.boardId} className="board-item">
                  <button
                    className="navigate-button"
                    onClick={() => navigate(`/workspace/${board.boardId}`)}
                    title={board.name || "Untitled Board"} // Tooltip for long names
                  >
                    {board.name || "Untitled Board"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </body>
  );
};
export default Workboard;
