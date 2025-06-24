import React, { useEffect, useRef } from "react";
import MessageBubble from "../MessageTypes/MessageBubbles/MessageBubble";
import InterruptRequest from "../MessageTypes/InterruptRequest/InterruptRequest";
import SearchStages from "../MessageTypes/SearchStages/SearchStages";
import PremiumTypingAnimation from "../MessageTypes/PremiumTyping/PreminumTypingAnnotation";
import "./MessageArea.css";

const MessageArea = ({ messages, setMessages, connectEventSource, checkpointId, isLoading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessage = (message) => {
    switch (message.type) {
      case "interrupt_request":
        return (
          <InterruptRequest
            key={message.id}
            message={message}
            connectEventSource={connectEventSource}
            checkpointId={checkpointId}
            setMessages={setMessages}
          />
        );

      case "search_stages":
        return <SearchStages key={message.id} data={message} />;

      case "error":
        return (
          <div key={message.id} className="error-message">
            <MessageBubble message={message} />
          </div>
        );

      case "message":
      default:
        return <MessageBubble key={message.id} message={message} />;
    }
  };

  return (
    <div className="message-area">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="loading-placeholder">Loading conversation…</div>
        ) : (
          messages.map(renderMessage)
        )}

        {isLoading && (
          <div className="typing-indicator">
            <PremiumTypingAnimation />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageArea;
