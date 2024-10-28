import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "./workboard.css";
import PostIt from "./functions/PostIts"

const Workboard = () => {
    const [postits, setPostits] = useState([])
    const navigate = useNavigate();


    const accountPageNav = () => {
        navigate("/workspace");       // TO DO: Change Navigate link to edit account page once fully functional
    }

    const addNote = () => {
        setPostits([
            ...postits,
            {
                id: Date.now(),
            },
        ])
    }

    const deletePostit = (postitId) => {
        setPostits(postits.filter(item => item.id !== postitId))
    }


    return (
        <html lang="en">
            <body class="board_body">
                <div class="toolbar_container">
                    <div class="head_container">
                        <input class="titletext" placeholder="Title:"></input>
                        <h1 class="name_header">Ideation for All</h1>
                        <button
                            class="account_button"
                            onClick={accountPageNav}>TestAccount123</button>
                    </div>
                    <div class="options_container">
                        <button class="save_or_share_button">Save...</button>
                        <button class="save_or_share_button">Share</button>
                    </div>
                    <div class="workspace_container">
                        <button class="workspace_button" onClick={addNote}>Create new post-it</button>
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
    )
};
export default Workboard;