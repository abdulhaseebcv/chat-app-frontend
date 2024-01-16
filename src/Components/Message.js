import React from "react";

function Message({ author, message, time, isCurrentUser }) {
  return (
    <div className="message" id={isCurrentUser ? "you" : "other"}>
      <div>
        <div className="message-content">
          <p>{message}</p>
        </div>
        <div className="message-meta">
          <p id="time">{time}</p>
          <p id="author">{isCurrentUser ? "Me" : author}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;
