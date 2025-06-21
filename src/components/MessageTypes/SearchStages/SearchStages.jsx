import React from "react";
import "./SearchStages.css";

const SearchStages = ({ data }) => {
  const { searchInfo } = data;
  
  if (!searchInfo) return null;

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

  const getStageText = (stage) => {
    switch (stage) {
      case "searching":
        return "Searching for information...";
      case "reading":
        return "Reading and analyzing sources...";
      case "completed":
        return "Analysis complete";
      case "error":
        return "Search encountered an error";
      default:
        return stage;
    }
  };

  const isStageActive = (stage) => {
    const stages = searchInfo.stages;
    if (!stages.length) return false;
    
    const currentStage = stages[stages.length - 1];
    return stage === currentStage && currentStage !== "completed" && currentStage !== "error";
  };

  return (
    <div className="search-stages">
      <div className="search-query">
        <span className="search-query-label">Searching:</span>
        <span className="search-query-text">{searchInfo.query}</span>
      </div>
      
      <div className="search-progress">
        {searchInfo.stages.map((stage, index) => (
          <div 
            key={index} 
            className={`search-stage ${isStageActive(stage) ? 'active' : 'completed'}`}
          >
            <span className="stage-icon">{getStageIcon(stage)}</span>
            <span className="stage-text">{getStageText(stage)}</span>
            {isStageActive(stage) && (
              <div className="stage-spinner">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {searchInfo.urls && searchInfo.urls.length > 0 && (
        <div className="search-sources">
          <div className="sources-header">
            <span className="sources-icon">📚</span>
            <span className="sources-label">Sources ({searchInfo.urls.length})</span>
          </div>
          <div className="search-urls">
            {searchInfo.urls.map((url, index) => (
              <a 
                href={url} 
                key={index} 
                target="_blank" 
                rel="noopener noreferrer"
                className="search-url"
              >
                <span className="url-icon">🔗</span>
                <span className="url-text">{new URL(url).hostname}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      
      {searchInfo.error && (
        <div className="search-error">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{searchInfo.error}</span>
        </div>
      )}
    </div>
  );
};

export default SearchStages;