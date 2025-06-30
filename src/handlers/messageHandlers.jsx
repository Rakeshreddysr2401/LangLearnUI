import { v4 as uuidv4 } from "uuid";

/**
 * Handles incoming event data from the EventSource stream
 */
export const handleEventData = (
  event,
  setMessages,
  responseId,
  setCheckpointId
) => {
  try {
    const data = JSON.parse(event.data);
    console.log('Received event:', data);

    switch (data.type) {
      case "checkpoint":
        setCheckpointId(data.checkpoint);
        break;

      case "content":
        handleContentMessage(data, setMessages, responseId);
        break;

      case "tool_calling":
        handleToolCalling(data, setMessages, responseId);
        break;

      case "search_urls":
        handleSearchUrls(data, setMessages, responseId);
        break;

      case "interrupt_request":
        handleInterruptRequest(data, setMessages);
        break;

      case "tool_error":
        handleToolError(data, setMessages);
        break;

      case "error":
        handleError(data, setMessages);
        break;

     
      case "end":
          handleStreamEnd(setMessages);
          return "end"; // 🔥 return so App knows we hit end

      default:
        console.warn("Unknown event type:", data.type, data);
        // Handle unknown types gracefully
        handleGenericMessage(data, setMessages);
        break;
    }
  } catch (error) {
    console.error("Error parsing event data:", error, event.data);
    handleParseError(setMessages);
  }
};

/**
 * Handle content messages (AI responses)
 */
const handleContentMessage = (data, setMessages, responseId) => {
  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === responseId && msg.isLoading
        ? { 
            ...msg, 
            content: (msg.content || "") + data.content,
            isLoading: false 
          }
        : msg
    )
  );
};

/**
 * Handle tool calling events - inserts search stages before assistant response
 */
const handleToolCalling = (data, setMessages, responseId) => {
  setMessages((prev) => {
    // Create new search_stages message
    const newSearchStage = {
      id: uuidv4(),
      responseId,
      type: "search_stages",
      isUser: false,
      content: "", // not used, but kept for consistency
      searchInfo: {
        stages: ["searching"],
        query: data.query,
        urls: [],
      },
    };

    // Find the index of the assistant response message (id === responseId)
    const targetIndex = prev.findIndex(msg => msg.id === responseId);

    if (targetIndex !== -1) {
      // Insert search_stages just before the assistant message
      const before = prev.slice(0, targetIndex);
      const after = prev.slice(targetIndex);
      return [...before, newSearchStage, ...after];
    } else {
      // Fallback: append at the end
      return [...prev, newSearchStage];
    }
  });
};

/**
 * Handle search URLs from tool results - matches to the correct search stages
 */
const handleSearchUrls = (data, setMessages, responseId) => {
  setMessages((prev) =>
    prev.map((msg) => {
      // Find the search_stages message for this response
      if (msg.type === "search_stages" && 
          msg.responseId === responseId &&
          msg.searchInfo?.stages.includes("searching") &&
          !msg.searchInfo?.stages.includes("reading")) {
        return {
          ...msg,
          searchInfo: {
            ...msg.searchInfo,
            urls: Array.isArray(data.urls) ? data.urls : [],
            stages: [...msg.searchInfo.stages, "reading"],
          },
        };
      }
      return msg;
    })
  );
};

/**
 * Handle interrupt requests from the agent
 */
const handleInterruptRequest = (data, setMessages) => {
  setMessages((prev) => [
    ...prev,
    {
      id: uuidv4(),
      isUser: false,
      type: "interrupt_request",
      interruptType: data.interruptType || "generic",
      content: data.payload || data,
    },
  ]);
};

/**
 * Handle tool errors
 */
const handleToolError = (data, setMessages) => {
  setMessages((prev) => [
    ...prev,
    {
      id: uuidv4(),
      content: `Tool Error: ${data.error}`,
      isUser: false,
      type: "error",
      isError: true,
    },
  ]);
};

/**
 * Handle general errors
 */
const handleError = (data, setMessages) => {
  setMessages((prev) => [
    ...prev,
    {
      id: uuidv4(),
      content: `Error: ${data.error}`,
      isUser: false,
      type: "error",
      isError: true,
    },
  ]);
};

/**
 * Handle stream end
 */
const handleStreamEnd = (setMessages) => {
  setMessages((prev) =>
    prev.map((msg) => {
      if (msg.isLoading) {
        return { ...msg, isLoading: false };
      }

      // 👇 Only promote "searching" to "completed" when no reading/completed stage exists
      if (
        msg.type === "search_stages" &&
        msg.searchInfo?.stages.includes("searching") &&
        !msg.searchInfo?.stages.includes("reading") &&
        !msg.searchInfo?.stages.includes("completed")
      ) {
        return {
          ...msg,
          searchInfo: {
            ...msg.searchInfo,
            stages: [...msg.searchInfo.stages, "completed"],
          },
        };
      }

      // Normal case: append "completed" after reading
      if (
        msg.type === "search_stages" &&
        msg.searchInfo?.stages.includes("reading") &&
        !msg.searchInfo?.stages.includes("completed")
      ) {
        return {
          ...msg,
          searchInfo: {
            ...msg.searchInfo,
            stages: [...msg.searchInfo.stages, "completed"],
          },
        };
      }

      return msg;
    })
  );
};



/**
 * Handle unknown message types
 */
const handleGenericMessage = (data, setMessages) => {
  setMessages((prev) => [
    ...prev,
    {
      id: uuidv4(),
      isUser: false,
      type: data.type || "unknown",
      content: data.content || JSON.stringify(data),
    },
  ]);
};

/**
 * Handle JSON parse errors
 */
const handleParseError = (setMessages) => {
  setMessages((prev) => [
    ...prev,
    {
      id: uuidv4(),
      content: "Error parsing server response",
      isUser: false,
      type: "error",
      isError: true,
    },  
  ]);
};