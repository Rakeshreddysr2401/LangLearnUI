import React from "react";
import PremiumTypingAnimation from "../PremiumTyping/PreminumTypingAnnotation";
import "./MessageBubble.css";

function MessageBubble({ message }) {
  const renderContent = () => {
    if (message.isLoading && !message.content) {
      return <PremiumTypingAnimation />;
    }

    if (message.isLoading && message.content) {
      return (
        <>
          {message.content}
          <PremiumTypingAnimation />
        </>
      );
    }

    return message.content || "";
  };

  return (
    <div
      className={`message-bubble-wrapper ${
        message.isUser ? "user" : "assistant"
      } ${message.isError ? "error" : ""}`}
    >
      {renderContent()}
    </div>
  );
}

export default MessageBubble;
