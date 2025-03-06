import { useState, useRef, useEffect } from "react";
import { sendUpdate } from "../../utils/websocket";

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
  onClose,
}) {
  const [move, setMove] = useState(false);
  const [text, setText] = useState(content); // Controlled state

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


  function mouseUp() {
    setMove(false);
    if (idToken) {
      sendUpdate(postItId, { position }, idToken); // Send update to backend
      console.log("Send update, " + position);
    }else{
      console.log("no idToken" + position);
    }
    console.log("sto moving, postid: " + postItId);
  }
  function mouseDown(e) {
    setMove(true);
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
      postitRef.current.style.left = fx + "px";
      postitRef.current.style.top = fy + "px";
      position.x = fx;
      position.y = fy;
      console.log("post-it moved");
    }
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
      <textarea
        value={text} // Ensure it's a controlled input
        onChange={handleTextChange}
        // onBlur={handleBlur}
      />
    </div>
  );
}
