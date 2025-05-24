import React, { useState } from 'react';
import '../styles/AllFlashcards.css';

const AllFlashcards = ({ sessions, onGoHome, hideHeader = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Combine all flashcards from all sessions into a single array
  const allFlashcards = sessions.flatMap(session => 
    (session.flashcards || []).map(card => ({
      ...card,
      sessionTitle: session.title || 'Untitled Session',
      sessionId: session.id
    }))
  );

  // Filter flashcards by search term (question, answer, or session title)
  const filteredFlashcards = allFlashcards.filter(card =>
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Return color based on difficulty level
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'new': return '#4361ee';
      case 'learning': return '#f77f00';
      case 'difficult': return '#e63946';
      case 'mastered': return '#2a9d8f';
      default: return '#6c757d'; // default gray
    }
  };

  return (
    <div className="all-flashcards">
      
      {/* Optional header section */}
      {!hideHeader && (
        <div className="flashcards-header">
          <button className="back-btn" onClick={onGoHome}>← Back to Home</button>
          <h2>All Flashcards ({allFlashcards.length})</h2>
        </div>
      )}

      {/* Search input */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search flashcards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Empty state if no flashcards match */}
      {filteredFlashcards.length === 0 ? (
        <div className="empty-state">
          <p>No flashcards found. Create some sessions to get started!</p>
        </div>
      ) : (
        <div className="flashcards-grid">
          {/* Render each flashcard */}
          {filteredFlashcards.map((card) => (
            <div key={`${card.sessionId}-${card.id}`} className="flashcard-item">
              <div className="card-header">
                {/* Show difficulty with colored badge */}
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
                >
                  {card.difficulty}
                </span>

                {/* Show session title if header is not hidden */}
                {!hideHeader && <span className="session-name">{card.sessionTitle}</span>}
              </div>

              {/* Flashcard content */}
              <div className="card-content">
                <div className="question"><strong>Q:</strong> {card.question}</div>
                <div className="answer"><strong>A:</strong> {card.answer}</div>
              </div>

              {/* Review statistics */}
              <div className="card-stats">
                <span>Reviews: {card.reviewCount}</span>
                <span>Next: {new Date(card.nextReview).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFlashcards;
