import React from "react";
import PremiumTypingAnimation from "../PremiumTyping/PreminumTypingAnnotation";
import "./MessageBubble.css";

function MessageBubble({ message }) {
  const content = message.content || "";

  return (
    <div className={`message-bubble-wrapper ${message.isUser ? "user" : "assistant"} ${message.isError ? "error" : ""}`}>
      {message.isLoading && !content ? <PremiumTypingAnimation /> : content}
    </div>
  );
}

export default MessageBubble;
