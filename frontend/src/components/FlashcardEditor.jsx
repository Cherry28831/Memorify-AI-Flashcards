import React, { useState } from 'react';
import '../styles/FlashcardEditor.css';

const FlashcardEditor = ({ card, onSave, onCancel }) => {
  // Initialize state with card data or default empty strings
  const [editedCard, setEditedCard] = useState({
    question: card?.question || '',
    answer: card?.answer || '',
  });

  // Handle input changes for both question and answer
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Call onSave prop with updated card when form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedCard);
  };

  return (
    <div className="card-editor">
      <h2>Edit Flashcard</h2>

      <form onSubmit={handleSubmit}>
        {/* Question input */}
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <textarea
            id="question"
            name="question"
            value={editedCard.question}
            onChange={handleChange}
            required
          />
        </div>

        {/* Answer input */}
        <div className="form-group">
          <label htmlFor="answer">Answer:</label>
          <textarea
            id="answer"
            name="answer"
            value={editedCard.answer}
            onChange={handleChange}
            required
          />
        </div>

        {/* Action buttons */}
        <div className="button-group">
          <button type="button" className="btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlashcardEditor;
