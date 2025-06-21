  import Headers from "./components/Headers/Headers";
  import MessageArea from "./components/MessageArea/MessageArea";
  import InputBar from "./components/InputBar/InputBar";
  import React, { useState, useRef, useCallback } from "react";
  import { handleEventData } from "./handlers/messageHandlers";
  import "./App.css";

  function App() {
    const [messages, setMessages] = useState([
      {
        id: 1,
        content: "Hi there, how can I help you?",
        isUser: false,
        type: "message",
      },
    ]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [checkpointId, setCheckpointId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const eventSourceRef = useRef(null);

    /**
     * Sets up a new EventSource connection
     * @param {string} message – The message to send
     * @param {boolean} interrupt – Flag indicating if this is an interrupt response
     * @param {number} responseId – ID of the response message to update
     */
    const connectEventSource = useCallback((message, interrupt = false, responseId = null) => {
      // Close existing stream if active
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      setIsLoading(true);

      let url = `http://localhost:8000/chat_stream/${encodeURIComponent(message)}`;
      const params = new URLSearchParams();
      
      if (checkpointId) {
        params.append('checkpoint_id', checkpointId);
      }
      if (interrupt) {
        params.append('interrupt', 'true');
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      // Use provided responseId or generate one for interrupts
      const actualResponseId = responseId || (Date.now() + 1);

    eventSource.onmessage = (event) => {
    const status = handleEventData(
      event,
      setMessages,
      actualResponseId,
      setCheckpointId
    );

    if (status === "end") {
      eventSource.close();
      eventSourceRef.current = null;
      setIsLoading(false); // stop the loader
    }
};


      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        setIsLoading(false);
        eventSource.close();
        eventSourceRef.current = null;
        
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            content: "Sorry, there was an error processing your request.",
            isUser: false,
            type: "message",
            isError: true,
          },
        ]);
      };

      eventSource.addEventListener('end', () => {
        setIsLoading(false);
        eventSource.close();
        eventSourceRef.current = null;
      });

    }, [checkpointId]);

    /**
     * Handles new message submission
     */
    const handleSubmit = useCallback((e) => {
      e.preventDefault();
      if (currentMessage.trim() && !isLoading) {
        const newMessageId = Date.now();
        
        // Add user message
        setMessages((prev) => [
          ...prev,
          {
            id: newMessageId,
            content: currentMessage,
            isUser: true,
            type: "message",
          },
        ]);

        // Add loading assistant message
        const responseId = newMessageId + 1;
        setMessages((prev) => [
          ...prev,
          {
            id: responseId,
            content: "",
            isUser: false,
            type: "message",
            isLoading: true,
          },
        ]);

        // Send message to backend
        connectEventSource(currentMessage, false, responseId);
        setCurrentMessage("");
      }
    }, [currentMessage, isLoading, connectEventSource]);

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    }, []);

    return (
      <div className="App">
        <div className="headers">
          <Headers />
        </div>
        <div className="body">
          <div className="left-sidebar">
            {/* Future: Navigation, conversation history, etc. */}
          </div>
          <div className="main-content">
            <div className="agent">
              <MessageArea 
                messages={messages} 
                setMessages={setMessages}
                connectEventSource={connectEventSource}
                checkpointId={checkpointId}
                isLoading={isLoading}
              />
              <InputBar
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default App;