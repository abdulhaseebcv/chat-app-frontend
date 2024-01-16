import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat';

// Connect to the Socket.IO server running at http://localhost:3001
const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

function JoinRoom() {
    // State to manage username, room, and whether to show the chat component
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);

    // Function to join a room when the "Join" button is clicked
    const joinRoom = () => {
        if (username !== "" || room !== "") {
            // Emit the "join_room" event to the server with the specified room ID
            socket.emit("join_room", room);
            // Set showChat to true, indicating that the chat component should be displayed
            setShowChat(true);
        }
    }

    return (
        <>
            {!showChat ? (
                // Display the join chat container if showChat is false
                <div className="joinChatContainer">
                    <h3>Access the Chat</h3>
                    <input type="text" placeholder='Name' onChange={(e) => setUsername(e.target.value)} />
                    <input type="text" placeholder='Room ID' onChange={(e) => setRoom(e.target.value)} />
                    <button onClick={joinRoom}>Join</button>
                </div>
            ) : (
                // Display the Chat component if showChat is true
                <Chat socket={socket} username={username} room={room} />
            )}
        </>
    );
}

export default JoinRoom;
