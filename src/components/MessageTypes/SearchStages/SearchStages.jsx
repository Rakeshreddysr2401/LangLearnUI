import React from "react";
import "./SearchStages.css";

const SearchStages = ({ data }) => {
  const { searchInfo } = data;
  if (!searchInfo) {
    return <div className="search-stages loading">Retrieving search information…</div>;
  }

  const getStageIcon = (stage) => {
    switch (stage) {
      case "searching":
        return "🔍";
      case "reading":
        return "📖";
      case "completed":
        return "✅";
      case "error":
        return "❌";
      default:
        return "⚡";
    }
  };

  const stageLabels = {
    searching: "Searching...",
    reading: "Reading sources...",
    completed: "Completed!",
    error: "Something went wrong!",
  };

  const latestStage = searchInfo.stages?.[searchInfo.stages.length - 1];

  return (
    <div className="search-stages">
      <div className="search-query">Searching: {searchInfo.query}</div>

      {latestStage && (
        <div className="search-progress">
          <div className="search-stage active">
            <span className="stage-icon">{getStageIcon(latestStage)}</span>
            <span className="stage-text">{stageLabels[latestStage] || latestStage}</span>
          </div>
        </div>
      )}

      {searchInfo.urls && searchInfo.urls.length > 0 && (
        <div className="search-sources">
          <div>Sources ({searchInfo.urls.length}):</div>
          {searchInfo.urls.map((url, index) => (
            <a
              href={url}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="search-url"
            >
              {new URL(url).hostname}
            </a>
          ))}
        </div>
      )}

      {searchInfo.error && <div className="search-error">{searchInfo.error}</div>}
    </div>
  );
};

export default SearchStages;
