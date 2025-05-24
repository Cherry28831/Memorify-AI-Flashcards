import React, { useState, useEffect } from 'react';
import HomePage from '../components/HomePage';
import ChatSession from '../components/ChatSession';
import NavBar from '../components/NavBar';
import FlashcardApp from '../components/FlashcardApp';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark');
    }

    // Load saved flashcard sessions
    const savedSessions = localStorage.getItem('flashcardSessions');
    if (savedSessions) {
      // Sort sessions by creation date (newest first)
      const parsedSessions = JSON.parse(savedSessions);
      parsedSessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSessions(parsedSessions);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', newMode);
  };

  const createNewChat = () => {
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    setCurrentView('chat');
  };

  const openSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setCurrentView('chat');
  };

  const saveSession = (sessionData) => {
    // Add new session at the beginning of the array
    const updatedSessions = [
      sessionData,
      ...sessions.filter(s => s.id !== sessionData.id)
    ];
    setSessions(updatedSessions);
    localStorage.setItem('flashcardSessions', JSON.stringify(updatedSessions));
  };

  const deleteSession = (sessionId) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('flashcardSessions', JSON.stringify(updatedSessions));
  };

  const goHome = () => {
    setCurrentView('home');
    setCurrentSessionId(null);
  };

  const goToGenerateFlashcards = () => {
    setCurrentView('generate-flashcards');
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm) ||
    (session.flashcards && session.flashcards.some(card => 
      card.question.toLowerCase().includes(searchTerm) ||
      card.answer.toLowerCase().includes(searchTerm)
    ))
  );

  const styles = {
    appContainer: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: darkMode ? '#121212' : '#f8f9fa',
      color: darkMode ? '#e9ecef' : '#212529',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      overflow: 'hidden',
    },
    mainContent: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto'
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            sessions={filteredSessions}
            onNewChat={createNewChat}
            onOpenSession={openSession}
            onDeleteSession={deleteSession}
            onSearch={handleSearch}
            searchTerm={searchTerm}
            darkMode={darkMode}
          />
        );
      case 'chat':
        return (
          <ChatSession
            sessionId={currentSessionId}
            sessions={sessions}
            onSaveSession={saveSession}
            onGoHome={goHome}
            darkMode={darkMode}
          />
        );
      case 'generate-flashcards':
        return (
          <FlashcardApp
            onGoHome={goHome}
            darkMode={darkMode}
            // Pass any props needed by FlashcardApp here
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.appContainer}>
      <NavBar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        currentView={currentView}
        onHome={goHome}
        onNewChat={createNewChat}
        onGenerateFlashcards={goToGenerateFlashcards}
      />
      <main style={styles.mainContent}>
        {renderView()}
      </main>
    </div>
  );
};

export default Home;