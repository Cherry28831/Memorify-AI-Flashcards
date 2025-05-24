import React, { useState, useEffect } from 'react';
import '../styles/FlashcardViewer.css';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, DeleteIcon } from './Icons';
import FlashcardEditor from './FlashcardEditor';

const FlashcardViewer = ({ flashcards, onReviewResult, onEdit, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dueCards, setDueCards] = useState([]);
  
  useEffect(() => {

    const now = new Date();
    const due = flashcards.filter(card => new Date(card.nextReview) <= now);
    setDueCards(due.length ? due : flashcards);
  }, [flashcards]);

  const currentCard = dueCards[currentIndex] || null;
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowAnswer(true);
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setShowAnswer(false);
  
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex < dueCards.length - 1 ? prevIndex + 1 : 0
      );
    }, 220); 
  };
  
  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowAnswer(false);
  
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : dueCards.length - 1
      );
    }, 300);
  };
  
  const handleReview = (result) => {
    if (currentCard) {
      onReviewResult(currentCard.id, result);
      handleNextCard();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (updatedCard) => {
    onEdit(currentCard.id, updatedCard);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      onDelete(currentCard.id);
      if (currentIndex >= dueCards.length - 1) {
        setCurrentIndex(Math.max(0, dueCards.length - 2));
      }
    }
  };

  if (dueCards.length === 0) {
    return (
      <div className="flashcard-container empty">
        <h2>You don't have any flashcards yet.</h2>
        <p>Go to "Create Cards" to generate flashcards from your notes.</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <FlashcardEditor 
        card={currentCard}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="flashcard-container">
      <div className="flashcard-progress">
        <span>Card {currentIndex + 1} of {dueCards.length}</span>
      </div>
      
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <p>{currentCard?.question}</p>
            <div className="flip-instruction">Click to reveal answer</div>
          </div>
          <div className="flashcard-back">
            <p>{currentCard?.answer}</p>
          </div>
        </div>
      </div>
      
      <div className="flashcard-actions">
        <button onClick={handleEdit} className="action-btn edit-btn" title="Edit card">
          <EditIcon />
        </button>
        
        <button onClick={handlePrevCard} className="nav-btn prev-btn">
          <ChevronLeftIcon />
        </button>
        
        {showAnswer && (
          <div className="rating-buttons">
            <button onClick={() => handleReview('hard')} className="rating-btn hard">Hard</button>
            <button onClick={() => handleReview('medium')} className="rating-btn medium">Good</button>
            <button onClick={() => handleReview('easy')} className="rating-btn easy">Easy</button>
          </div>
        )}
        
        <button onClick={handleNextCard} className="nav-btn next-btn">
          <ChevronRightIcon />
        </button>
        
        <button onClick={handleDelete} className="action-btn delete-btn" title="Delete card">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;