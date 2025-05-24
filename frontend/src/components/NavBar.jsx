import React from 'react';
import '../styles/NavBar.css';
import { MoonIcon, SunIcon } from '../components/Icons';

const NavBar = ({ darkMode, toggleDarkMode, currentView, onHome, onNewChat }) => {
  return (
    <nav className="navbar">
      {/* Brand logo and title - clickable to go Home */}
      <div className="navbar-brand" onClick={onHome}>
        <h1>Memorify</h1>
        <p>AI-Powered Study Cards</p>
      </div>
      
      <div className="nav-actions">
        {/* Show Home button only if not on home view */}
        {currentView !== 'home' && (
          <button className="nav-btn" onClick={onHome}>
            Home
          </button>
        )}

        {/* Button to start a new chat/session */}
        <button className="nav-btn" onClick={onNewChat}>
          New Chat
        </button>
        
        {/* Dark mode toggle button */}
        <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
