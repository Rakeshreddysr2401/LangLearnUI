import React, { useEffect, useRef } from "react";
import "./MessageArea.css";

const PremiumTypingAnimation = () => {
  return (
    <div className="typing-dots">
      <span className="dot" style={{ animationDelay: "0ms" }}></span>
      <span className="dot" style={{ animationDelay: "300ms" }}></span>
      <span className="dot" style={{ animationDelay: "600ms" }}></span>
    </div>
  );
};

const SearchStages = ({ searchInfo }) => {
  if (!searchInfo || !searchInfo.stages || searchInfo.stages.length === 0)
    return null;

  return (
    <div className="search-stages">
      {searchInfo.stages.includes("searching") && (
        <div className="stage">
          <div className="dot teal"></div>
          <div className="stage-text">Searching the web</div>
          <div className="stage-query">{searchInfo.query}</div>
        </div>
      )}
      {searchInfo.stages.includes("reading") && (
        <div className="stage">
          <div className="dot teal"></div>
          <div className="stage-text">Reading</div>
          <div className="stage-links">
            {Array.isArray(searchInfo.urls) ? (
              searchInfo.urls.map((url, i) => (
                <div className="url-badge" key={i}>
                  {typeof url === "string"
                    ? url
                    : JSON.stringify(url).substring(0, 30)}
                </div>
              ))
            ) : (
              <div className="url-badge">
                {typeof searchInfo.urls === "string"
                  ? searchInfo.urls.substring(0, 30)
                  : JSON.stringify(searchInfo.urls).substring(0, 30)}
              </div>
            )}
          </div>
        </div>
      )}
      {searchInfo.stages.includes("writing") && (
        <div className="stage">
          <div className="dot teal"></div>
          <div className="stage-text">Writing answer</div>
        </div>
      )}
      {searchInfo.stages.includes("error") && (
        <div className="stage">
          <div className="dot red"></div>
          <div className="stage-text">Search error</div>
          <div className="error-message">
            {searchInfo.error || "An error occurred during search."}
          </div>
        </div>
      )}
    </div>
  );
};

const MessageArea = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-area">
      <div className="message-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${
              message.isUser ? "user" : "assistant"
            }`}
          >
            <div className="message-bubble">
              {!message.isUser && message.searchInfo && (
                <SearchStages searchInfo={message.searchInfo} />
              )}

              {message.isLoading ? (
                <PremiumTypingAnimation />
              ) : message.content ? (
                message.content
              ) : (
                <span className="waiting-text">Waiting for response...</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageArea;
