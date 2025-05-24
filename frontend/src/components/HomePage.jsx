import React, { useState } from 'react';

const styles = {
  homepage: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  homepageHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  homepageHeaderH1: {
    fontSize: '3rem',
    margin: 0,
    color: 'var(--primary)',
    fontWeight: 700,
  },
  homepageHeaderP: {
    fontSize: '1.2rem',
    color: 'var(--foreground)',
    opacity: 0.8,
    margin: '0.5rem 0 0 0',
  },

  // Search bar container and input styles
  searchContainer: {
    position: 'relative',
    width: '22rem',
    margin: '0 auto 1.5rem auto',
    display: 'flex',
    justifyContent: 'center',
  },
  searchInput: {
    width: '100%',
    padding: '0.5rem 1rem 0.5rem 2.5rem', // left padding for icon space
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    backgroundColor: 'var(--card)',
    color: 'var(--foreground)',
    transition: 'all 0.2s ease',
    height: '2.25rem',
  },
  searchInputFocus: {
    outline: 'none',
    borderColor: 'var(--primary)',
    boxShadow: '0 0 0 2px rgba(77, 171, 247, 0.1)',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.8rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--foreground)',
    opacity: 0.6,
    width: '1rem',
    height: '1rem',
    pointerEvents: 'none',
  },

  // Buttons container and buttons styles
  homepageActions: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    marginBottom: '4rem',
    flexWrap: 'wrap',
  },
  actionBtn: {
    width: '300px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    textDecoration: 'none',
    minWidth: '220px',
    justifyContent: 'center',
  },
  actionBtnPrimary: {
    backgroundColor: 'var(--primary)',
    color: 'white',
  },
  actionBtnPrimaryHover: {
    backgroundColor: 'var(--secondary)',
    transform: 'translateY(-3px)',
  },
  icon: {
    fontSize: '1.2rem',
  },

  // Stats cards styles
  homepageStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: 'var(--card)',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
    cursor: 'default',
  },
  statCardH3: {
    fontSize: '2.5rem',
    margin: 0,
    color: 'var(--primary)',
    fontWeight: 600,
  },
  statCardP: {
    margin: '0.5rem 0 0 0',
    color: 'var(--foreground)',
    opacity: 0.8,
  },

  // Libraries (Sessions) list styles
  homepageLibrariesH2: {
    color: 'var(--foreground)',
    marginBottom: '2rem',
    fontSize: '1.8rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--foreground)',
    opacity: 0.6,
  },
  librariesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  libraryCard: {
    backgroundColor: 'var(--card)',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default',
  },
  libraryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  libraryHeaderH3: {
    margin: 0,
    color: 'var(--foreground)',
    fontSize: '1.2rem',
    fontWeight: 600,
    flex: 1,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--error)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s ease',
  },
  libraryInfo: {
    margin: '0.5rem 0',
    color: 'var(--primary)',
    fontWeight: 500,
  },
  libraryDate: {
    margin: '0.5rem 0 1.5rem 0',
    color: 'var(--foreground)',
    opacity: 0.6,
    fontSize: '0.9rem',
  },
  openBtn: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

const HomePage = ({ 
  sessions, 
  onNewChat, 
  onOpenSession, 
  onDeleteSession,
  onSearch,
  searchTerm,
}) => {
  // Calculate total flashcards and total sessions
  const totalFlashcards = sessions.reduce((total, session) => total + (session.flashcards?.length || 0), 0);
  const totalSessions = sessions.length;

  // Manage hover state for the new chat button
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <div style={styles.homepage}>
      {/* Header Section */}
      <div style={styles.homepageHeader}>
        <h1 style={styles.homepageHeaderH1}>Memorify</h1>
        <p style={styles.homepageHeaderP}>AI-Powered Study Cards</p>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <div style={styles.searchIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <input
          type="text"
          style={{
            ...styles.searchInput,
            ...(document.activeElement === document.querySelector('input') ? styles.searchInputFocus : {})
          }}
          placeholder="Search sessions or flashcards..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Create New Session Button */}
      <div style={styles.homepageActions}>
        <button
          style={{
            ...styles.actionBtn,
            ...styles.actionBtnPrimary,
            width: '320px',
            fontSize: '1.25rem',
            ...(hoveredBtn === 'newChat' ? styles.actionBtnPrimaryHover : {}),
          }}
          onClick={onNewChat}
          onMouseEnter={() => setHoveredBtn('newChat')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <span style={{ ...styles.icon, fontSize: '1.4rem' }}>+</span>
          Create New Session
        </button>
      </div>

      {/* Stats Section */}
      <div style={styles.homepageStats}>
        <div style={styles.statCard}>
          <h3 style={styles.statCardH3}>{totalSessions}</h3>
          <p style={styles.statCardP}>Study Sessions</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statCardH3}>{totalFlashcards}</h3>
          <p style={styles.statCardP}>Total Flashcards</p>
        </div>
      </div>

      {/* Libraries (Sessions) List */}
      <div>
        <h2 style={styles.homepageLibrariesH2}>Your Libraries</h2>
        {sessions.length === 0 ? (
          <div style={styles.emptyState}>
            <p>
              {searchTerm 
                ? 'No matching sessions found'
                : 'No study sessions yet. Create your first session to get started!'
              }
            </p>
          </div>
        ) : (
          <div style={styles.librariesGrid}>
            {sessions.map((session) => (
              <div key={session.id} style={styles.libraryCard}>
                <div style={styles.libraryHeader}>
                  <h3 style={styles.libraryHeaderH3}>{session.title || 'Untitled Session'}</h3>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => onDeleteSession(session.id)}
                    title="Delete session"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(230, 57, 70, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    &times;
                  </button>
                </div>

                <div style={styles.libraryInfo}>
                  {session.flashcards?.length || 0} Flashcards
                </div>
                <div style={styles.libraryDate}>
                  Created on {new Date(session.createdAt).toLocaleDateString()}
                </div>

                <button
                  style={styles.openBtn}
                  onClick={() => onOpenSession(session.id)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                >
                  Open Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
