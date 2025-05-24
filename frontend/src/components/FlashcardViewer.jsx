import React, { useState, useEffect } from 'react';
import '../styles/FlashcardViewer.css';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, DeleteIcon } from './Icons';
import FlashcardEditor from './FlashcardEditor';

const FlashcardViewer = ({ flashcards, onReviewResult, onEdit, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);      // Current flashcard index
  const [isFlipped, setIsFlipped] = useState(false);        // Flip state
  const [showAnswer, setShowAnswer] = useState(false);      // Whether to show answer
  const [isEditing, setIsEditing] = useState(false);        // Edit mode flag
  const [dueCards, setDueCards] = useState([]);             // Cards due for review
  const [error, setError] = useState(null);                 // Error state

  useEffect(() => {
    try {
      const now = new Date();
      const due = flashcards.filter(card => {
        try {
          return new Date(card.nextReview) <= now;
        } catch {
          return true; // Include invalid date cards
        }
      });

      setDueCards(due.length ? due : flashcards);

      // Adjust index if out of bounds after filtering
      if (currentIndex >= due.length && due.length > 0) {
        setCurrentIndex(due.length - 1);
      }
    } catch {
      setError("Error processing flashcards.");
      setDueCards(flashcards);
    }
  }, [flashcards, currentIndex]);

  const currentCard = dueCards[currentIndex] || null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) setShowAnswer(true);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % dueCards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev === 0 ? dueCards.length - 1 : prev - 1));
  };

  const handleReview = (result) => {
    if (!currentCard) return;
    try {
      onReviewResult(currentCard.id, result);
      handleNextCard();
    } catch {
      setError("Failed to save your review. Please try again.");
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSaveEdit = (updatedCard) => {
    try {
      onEdit(currentCard.id, updatedCard);
      setIsEditing(false);
      setError(null);
    } catch {
      setError("Failed to save your changes. Please try again.");
    }
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) return;
    try {
      onDelete(currentCard.id);
      if (dueCards.length <= 1) return;
      if (currentIndex >= dueCards.length - 1) {
        setCurrentIndex(Math.max(0, dueCards.length - 2));
      }
    } catch {
      setError("Failed to delete the flashcard. Please try again.");
    }
  };

  // Handle empty or error state
  if (dueCards.length === 0) {
    return (
      <div className="flashcard-container empty">
        <h2>No flashcards available</h2>
        <p>Go to "Create Cards" to add flashcards.</p>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flashcard-container error">
        <h2>Error loading flashcard</h2>
        <p>Please refresh the page.</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <FlashcardEditor
        card={currentCard}
        onSave={handleSaveEdit}
        onCancel={() => {
          setIsEditing(false);
          setError(null);
        }}
      />
    );
  }

  return (
    <div className="flashcard-container">
      {/* Show error message if any */}
      {error && (
        <div className="flashcard-error">
          {error}
          <button
            onClick={() => setError(null)}
            className="error-dismiss-btn"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Card progress indicator */}
      <div className="flashcard-progress">
        <span>Card {currentIndex + 1} of {dueCards.length}</span>
      </div>

      {/* Flashcard display (click to flip) */}
      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
        aria-label={isFlipped ? "Answer" : "Question"}
        tabIndex="0"
        onKeyDown={(e) => e.key === 'Enter' && handleFlip()}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <p>{currentCard.question}</p>
            <div className="flip-instruction">Click or press Enter to reveal answer</div>
          </div>
          <div className="flashcard-back">
            <p>{currentCard.answer}</p>
          </div>
        </div>
      </div>

      {/* Flashcard action buttons */}
      <div className="flashcard-actions">
        <button onClick={handleEdit} className="action-btn edit-btn" title="Edit">
          <EditIcon />
        </button>

        <button onClick={handlePrevCard} className="nav-btn prev-btn" disabled={dueCards.length <= 1}>
          <ChevronLeftIcon />
        </button>

        {/* Rating buttons (only show after flipping) */}
        {showAnswer && (
          <div className="rating-buttons">
            <button onClick={() => handleReview('hard')} className="rating-btn hard">Hard</button>
            <button onClick={() => handleReview('medium')} className="rating-btn medium">Good</button>
            <button onClick={() => handleReview('easy')} className="rating-btn easy">Easy</button>
          </div>
        )}

        <button onClick={handleNextCard} className="nav-btn next-btn" disabled={dueCards.length <= 1}>
          <ChevronRightIcon />
        </button>

        <button onClick={handleDelete} className="action-btn delete-btn" title="Delete">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;
