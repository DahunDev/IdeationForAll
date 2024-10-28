import { useState, useRef } from "react"


export default function PostIt({ onClose }) { 
    const [move, setMove] = useState(false)
    const postitRef = useRef()

    const [dx, setDx] = useState(0)
    const [dy, setDy] = useState(0)

    function mouseUp() {
        setMove(false);
    }
    function mouseDown(e) {
        setMove(true);
        const coordinates = postitRef.current.getBoundingClientRect()
        setDx(e.clientX - coordinates.x)
        setDy(e.clientY - coordinates.y)
    }

    function mouseMove(e) {
        if (move) {
            const x = e.clientX - dx
            const y = e.clientY - dy
            postitRef.current.style.left = x + "px"
            postitRef.current.style.top = y + "px"
        }
    }

    return (
        <div className="post-it" ref={postitRef}>
            <div className="post-it-header"
                onMouseDown={mouseDown}
                onMouseUp={mouseUp}
                onMouseMove={mouseMove}>
                <div>Sticky Note</div>
                <div className="close" onClick={onClose}>
                    &times;
                </div>
            </div>
            <textarea cols="30" rows="10"></textarea>
        </div>
    )
}