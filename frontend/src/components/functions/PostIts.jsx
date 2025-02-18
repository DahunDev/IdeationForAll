import { useState, useRef } from "react";

export default function PostIt({
  id,
  boardID,
  name,
  userID,
  content,
  groupID,
  imageLink,
  font,
  position,
  size,
  onClose,
}) {
  const [move, setMove] = useState(false);
  const postitRef = useRef();

  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);

  function setPosition() {
    postitRef.current.style.left = position.x + "px";
    postitRef.current.style.right = position.x + "px";
  }
  function mouseUp() {
    setMove(false);
    console.log("stop moving");
  }
  function mouseDown(e) {
    setMove(true);
    const coordinates = postitRef.current.getBoundingClientRect();
    setDx(e.clientX - coordinates.x);
    setDy(e.clientY - coordinates.y);
    console.log("start moving");
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
      <textarea cols="30" rows="10">
        {content}
      </textarea>
    </div>
  );
}
