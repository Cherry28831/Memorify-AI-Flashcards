import React, { useState } from 'react';
import jsPDF from 'jspdf';
import '../styles/AllFlashcards.css';

const AllFlashcards = ({ sessions, onGoHome, hideHeader = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allFlashcards = sessions.flatMap(session =>
    (session.flashcards || []).map(card => ({
      ...card,
      sessionTitle: session.title || 'Untitled Session',
      sessionId: session.id,
    }))
  );

  const filteredFlashcards = allFlashcards.filter(card =>
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'new': return '#4361ee';
      case 'learning': return '#f77f00';
      case 'difficult': return '#e63946';
      case 'mastered': return '#2a9d8f';
      default: return '#6c757d';
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;

    allFlashcards.forEach((card, index) => {
      const cardText = `Session: ${card.sessionTitle}\nQ: ${card.question}\nA: ${card.answer}\n\n`;
      const splitText = doc.splitTextToSize(cardText, doc.internal.pageSize.width - 2 * margin);
      if (yOffset + splitText.length * 7 > pageHeight - margin) {
        doc.addPage();
        yOffset = 10;
      }
      doc.text(splitText, margin, yOffset);
      yOffset += splitText.length * 7 + 5;
    });

    doc.save('all_flashcards.pdf');
  };

  return (
    <div className="all-flashcards">
      {!hideHeader && (
        <>
          <div className="flashcards-header">
            <button className="back-btn" onClick={onGoHome}>← Back to Home</button>
            <h2>All Flashcards ({allFlashcards.length})</h2>
          </div>

          <div className="search-download-row">
            <input
              type="text"
              placeholder="Search flashcards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {allFlashcards.length > 0 && (
              <button className="download-btn" onClick={handleDownloadPDF}>
                Download PDF
              </button>
            )}
          </div>
        </>
      )}

      {filteredFlashcards.length === 0 ? (
        <div className="empty-state">
          <p>No flashcards found. Create some sessions to get started!</p>
        </div>
      ) : (
        <div className="flashcards-grid">
          {filteredFlashcards.map((card) => (
            <div key={`${card.sessionId}-${card.id}`} className="flashcard-item">
              <div className="card-header">
                <span
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
                >
                  {card.difficulty}
                </span>
                {!hideHeader && (
                  <span className="session-name">{card.sessionTitle}</span>
                )}
              </div>
              <div className="card-content">
                <div className="question"><strong>Q:</strong> {card.question}</div>
                <div className="answer"><strong>A:</strong> {card.answer}</div>
              </div>
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
