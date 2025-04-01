import { useState, useRef, useEffect } from "react";
import { sendPostItLock, sendUpdate } from "../../utils/websocket";

export default function PostIt({
  postItId,
  boardID,
  name,
  idToken,
  content,
  groupID,
  imageLink,
  font,
  position,
  size,
  locked,
  lockedBy,
  onClose,
}) {
  const [move, setMove] = useState(false);
  const [text, setText] = useState(content); // Controlled state
  const [isLocked, setIsLocked] = useState(locked || false); // Track if post-it is locked
  const [lockedByUser, setLockedByUser] = useState(lockedBy || null); // Track who locked it
  const [isEditing, setIsEditing] = useState(false);

  const postitRef = useRef();
  const timeoutRef = useRef(null);

  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);

  function setPosition() {
    postitRef.current.style.left = position.x + "px";
    postitRef.current.style.right = position.x + "px";
  }

  // Apply position when component mounts
  useEffect(() => {
    if (postitRef.current && position) {
      postitRef.current.style.left = `${position.x}px`;
      postitRef.current.style.top = `${position.y}px`;
    }
  }, [position]); // Runs whenever `position` updates

  // Handle page unload (when the user leaves the page)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isLocked && lockedByUser === idToken) {
        sendUpdate(postItId, { content: text }, idToken); // Save content before unlocking
        setIsLocked(false);
        setLockedByUser(null);
        setIsEditing(false); // Mark as done
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [idToken, postItId, text, isLocked, lockedByUser]);

  function mouseUp() {
    setMove(false);
    if (idToken) {
      sendUpdate(postItId, { position }, idToken); // Send update to backend
      setIsEditing(false);
      setIsLocked(false);
      setLockedByUser(null);
      console.log("Send update, " + position);
    } else {
      console.log("no idToken" + position);
    }
    console.log("sto moving, postid: " + postItId);
  }
  function mouseDown(e) {
    setMove(true);
    if (idToken) {
      sendPostItLock(postItId, idToken); // Send update to backend
      setIsEditing(false);
      setIsLocked(true);
      setLockedByUser(idToken);
    }
    const coordinates = postitRef.current.getBoundingClientRect();
    setDx(e.clientX - coordinates.x);
    setDy(e.clientY - coordinates.y);
    console.log("start moving");
  }

  function handleTextChange(e) {
    const newText = e.target.value;
    setText(newText);

    // Debounce updates to avoid sending too many requests
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (idToken) {
        sendUpdate(postItId, { content: newText }, idToken);
        console.log("Send update:", newText);
      }
    }, 500); // Adjust debounce time as needed
  }

  function mouseMove(e) {
    if (move) {
      const fx = e.clientX - dx;
      const fy = e.clientY - dy;
      if (fx < 0) {
        postitRef.current.style.left = 0 + "px";
      }
      else if (fx > window.screen.width - 310) {
        postitRef.current.style.left = (window.screen.width - 310) + "px";
      }
      else {
        postitRef.current.style.left = fx + "px";
      }
      if (fy < 0) {
        postitRef.current.style.top = 0 + "px";
      }
      else if (fy > window.screen.height - 380) {
        postitRef.current.style.top = (window.screen.height - 380) + "px";
      }
      else {
        postitRef.current.style.top = fy + "px";
      }
      position.x = fx;
      position.y = fy;
      console.log("post-it moved");
    }
  }

  function handleBlur(e) {
    console.log("Blur");
  }
  function handleEdit() {
    if (!idToken || isLocked) return;
    sendPostItLock(postItId, idToken);
    setIsEditing(true);
    setIsLocked(true);
    setLockedByUser(idToken);
  }

  function handleSave() {
    if (!idToken || !isEditing) return;
    sendUpdate(postItId, { content: text }, idToken);
    setIsEditing(false);
    setIsLocked(false);
    setLockedByUser(null);
  }
  return (
    <div className="post-it" ref={postitRef} onLoad={setPosition}>
      <div
        className="post-it-header"
        onMouseDown={mouseDown}
        onMouseLeave={mouseUp}
        onMouseUp={mouseUp}
        onMouseMove={mouseMove}
      >
        <div>{name || "Sticky Note"}</div>

        <div className="close" onClick={onClose}>
          &times;
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={text} // Ensure it's a controlled input
          onChange={handleTextChange}
          // onBlur={handleBlur}
          disabled={isLocked && lockedByUser !== idToken} // Disable if locked by another user
        />
      ) : (
        <textarea
          value={text}
          disabled={!isEditing} // Disable editing when not in edit mode
        />
      )}

      <div className="post-it-footer">
        {!isEditing && !(isLocked && lockedByUser !== idToken) && <button onClick={handleEdit}>Edit</button>}
        {isEditing && <button onClick={handleSave}>Done</button>}
        {isLocked && lockedByUser !== idToken && (
          <span className="lock-indicator">Locked by another user</span>
        )}
      </div>
    </div>
  );
}
