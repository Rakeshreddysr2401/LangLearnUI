import "./Headers.css";
import React from "react";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <div className="dot"></div>
        <span>Lang Agent</span>
      </div>
      <nav className="nav">
        <a href="#">Help</a>
      </nav>
    </header>
  );
};

export default Header;
