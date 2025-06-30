import React from "react";
import "./PreminumTypingAnnotation";

const PremiumTypingAnimation = () => (
  <div className="typing-dots">
    <span className="dot" style={{ animationDelay: "0ms" }}>Retrieving</span>
    <span className="dot" style={{ animationDelay: "300ms" }}>.</span>
    <span className="dot" style={{ animationDelay: "600ms" }}>..</span>
  </div>
);

export default PremiumTypingAnimation;
