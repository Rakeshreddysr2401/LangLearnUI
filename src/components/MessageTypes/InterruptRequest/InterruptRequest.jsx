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
  const [editedText, setEditedText] = useState("");
  

  // Handle different interrupt payload structures
  const getInterruptData = () => {
    
    const {content} = message;
    
    // Handle the structure from your example: {"type":"approve_reject","data":{...}}
    if (content) {
      return {
        type: content.type || "generic",
        mobile_number: content.number,
        text_msg: content.text_msg,
        context: "Please review and approve or reject this action.",
      };
    }
  };

  const interruptData = getInterruptData();


  const handleApprove = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const responseText = isEditing ? editedText : interruptData.text_msg;
      
      // Mark this interrupt as resolved
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id
            ? { ...msg, resolved: true, resolution: "approved" }
            : msg
        )
      );
      
      // Send approval to backend
      connectEventSource(  JSON.stringify({ status: "approved", text_msg: responseText }), true);
      
    } catch (error) {
      console.error("Error approving:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    if (isProcessing) return;
     
    // Mark this interrupt as resolved
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id
          ? { ...msg, resolved: true, resolution: "rejected" }
          : msg
      )
    );
    
    connectEventSource(JSON.stringify({"status":"rejected","text_msg":"I don't want to send it"}), true);
  
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(interruptData.text_msg);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText("");
  };

  // Don't show if already resolved
  if (message.resolved) {
    return (
      <div className="interrupt-request resolved">
        <div className="interrupt-resolution">
          ✓ {message.resolution === "approved" ? "Approved" : "Rejected"}
        </div>
      </div>
    );
  }

  return (
    <div className="interrupt-request">
      <div className="interrupt-header">
        <span className="interrupt-type">{interruptData.type}</span>
        {interruptData.mobile_number && (
          <span className="interrupt-phone">📞 {interruptData.mobile_number}</span>
        )}
      </div>
      
      <div className="interrupt-context">
        {interruptData.context}
      </div>
      
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
              <button 
                className="interrupt-cancel" 
                onClick={handleCancelEdit}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="interrupt-save" 
                onClick={() => setIsEditing(false)}
                disabled={isProcessing}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="interrupt-text">{interruptData.text_msg}</div>
            <button 
              className="interrupt-edit-btn" 
              onClick={handleEdit}
              disabled={isProcessing}
            >
              ✏️ Edit
            </button>
          </>
        )}
      </div>
      
      <div className="interrupt-actions">
        <button 
          className="interrupt-reject" 
          onClick={handleReject}
          disabled={isProcessing}
        >
          ❌ Reject
        </button>
        <button 
          className="interrupt-approve" 
          onClick={handleApprove}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "✅ Approve"}
        </button>
      </div>
    </div>
  );
};

export default InterruptRequest;