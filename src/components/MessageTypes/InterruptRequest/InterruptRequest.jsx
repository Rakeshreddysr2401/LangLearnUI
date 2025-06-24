import React, { useState } from "react";
import "./InterruptRequest.css";

const InterruptRequest = ({ 
  message, 
  connectEventSource, 
  checkpointId, 
  setMessages 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(
    message.content?.text_msg || ""
  );

  const getInterruptData = () => {
    const { content } = message;
    return {
      type: content?.type || "generic",
      mobile_number: content?.number,
      text_msg: editedText, // use editedText directly
      context: "Please review and approve or reject this action.",
    };
  };
  
  const interruptData = getInterruptData();

  const handleApprove = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id
            ? { ...msg, resolved: true, resolution: "approved", content: { ...msg.content, text_msg: editedText } }
            : msg
        )
      );

      connectEventSource(
        JSON.stringify({ status: "approved", text_msg: editedText }),
        true
      );
    } catch (error) {
      console.error("Error approving:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    if (isProcessing) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id
          ? { ...msg, resolved: true, resolution: "rejected" }
          : msg
      )
    );

    connectEventSource(
      JSON.stringify({ status: "rejected", text_msg: "Request rejected" }),
      true
    );
  };

  return message.resolved ? (
    <div className={`interrupt-summary ${message.resolution}`}>
      <h4>Request {message.resolution === "approved" ? "Approved ✅" : "Rejected ❌"}</h4>
      <p><strong>Message:</strong> {editedText}</p>
      {interruptData.mobile_number && (
        <p><strong>Recipient:</strong> {interruptData.mobile_number}</p>
      )}
    </div>
  ) : (
    <div className="interrupt-request">
      <div className="interrupt-header">
        <span className="interrupt-type">{interruptData.type}</span>
        {interruptData.mobile_number && (
          <span className="interrupt-phone">📞 {interruptData.mobile_number}</span>
        )}
      </div>

      <div className="interrupt-context">{interruptData.context}</div>

      <div className="interrupt-message">
        {isEditing ? (
          <div className="interrupt-edit">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="interrupt-textarea"
              rows={3}
            />
            <div className="interrupt-edit-actions">
              <button onClick={() => setIsEditing(false)} disabled={isProcessing}>Cancel</button>
              <button onClick={() => setIsEditing(false)} disabled={isProcessing}>Save</button>
            </div>
          </div>
        ) : (
          <>
            <div className="interrupt-text">{editedText}</div>
            <button className="interrupt-edit-btn" onClick={() => setIsEditing(true)} disabled={isProcessing}>✏️ Edit</button>
          </>
        )}
      </div>

      <div className="interrupt-actions">
        <button className="interrupt-reject" onClick={handleReject} disabled={isProcessing}>❌ Reject</button>
        <button className="interrupt-approve" onClick={handleApprove} disabled={isProcessing}>{isProcessing ? "Processing..." : "✅ Approve"}</button>
      </div>
    </div>
  );
};

export default InterruptRequest;
