import React from "react";
import "./SearchStages.css";

const SearchStages = ({ data }) => {
  const { searchInfo } = data;
  if (!searchInfo) {
    return <div className="search-stages loading">Retrieving search information…</div>;
  }

  const getStageIcon = (stage) => {
    switch (stage) {
      case "searching": return "🔍";
      case "reading": return "📖";
      case "completed": return "✅";
      case "error": return "❌";
      default: return "⚡";
    }
  };

  return (
    <div className="search-stages">
      <div className="search-query">Searching: {searchInfo.query}</div>
      <div className="search-progress">
        {searchInfo.stages.map((stage, index) => (
          <div key={index} className={`search-stage ${index === searchInfo.stages.length-1 ? 'active' : ''}`}>
            <span className="stage-icon">{getStageIcon(stage)}</span>
            <span className="stage-text">{stage}</span>
          </div>
        ))}
      </div>
      {searchInfo.urls && (
        <div className="search-sources">
          <div>Sources ({searchInfo.urls.length}):</div>
          {searchInfo.urls.map((url, index) => (
            <a href={url} key={index} target="_blank" rel="noopener noreferrer" className="search-url">
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
