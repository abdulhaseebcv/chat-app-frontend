import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./Message"; // Import the Message component for rendering individual messages

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const formattedTime = new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }).format(new Date());

            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: formattedTime,
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        // Handle receiving new messages from the server
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        // Handle receiving previous messages when joining a room
        socket.on("previous_messages", (previousMessages) => {
            setMessageList(previousMessages);
        });

        // Clean up event listeners on component unmount
        return () => {
            socket.off("receive_message");
            socket.off("previous_messages");
        };

    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent, index) => (
                        // Render individual messages using the Message component
                        <Message
                            key={index}
                            author={messageContent.author}
                            message={messageContent.message}
                            time={messageContent.time}
                            isCurrentUser={username === messageContent.author}
                        />
                    ))}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Hey..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;
