import React, { useState } from 'react';
import '../styles/NotesInputForm.css';

const MAX_LENGTH = 10000;

const NotesInputForm = ({ onGenerateFlashcards, isLoading }) => {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  // Handle textarea input change with max length validation
  const handleTextareaChange = (e) => {
    const input = e.target.value;
    if (input.length <= MAX_LENGTH) {
      setNotes(input);
      setError(null); // Clear error on valid input
    } else {
      setError(`Note limit exceeded. Maximum ${MAX_LENGTH} characters allowed.`);
    }
  };

  // Validate input and submit notes for flashcard generation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedNotes = notes.trim();

    if (!trimmedNotes) {
      setError('Please enter notes or upload a file.');
      return;
    }
    if (trimmedNotes.length < 30) {
      setError('Notes are too short. Please provide more content.');
      return;
    }
    if (trimmedNotes.length > MAX_LENGTH) {
      setError(`Notes exceed the maximum limit of ${MAX_LENGTH} characters.`);
      return;
    }

    try {
      await onGenerateFlashcards(trimmedNotes);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to generate flashcards. Please try again.');
    }
  };

  return (
    <div className="notes-input-section">
      <div className="input-header">
        <h2>Create Flashcards</h2>
        <p>Paste your lecture notes and Memorify will automatically generate flashcards for you.</p>
      </div>

      <form className="notes-form" onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            {error}
            <button 
              type="button" 
              className="error-dismiss"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div className="textarea-container">
          <textarea 
            value={notes}
            onChange={handleTextareaChange}
            placeholder="Paste your lecture notes or text here..."
            rows={10}
            aria-label="Notes input"
          />
          <div className={`char-count ${notes.length > MAX_LENGTH ? 'over-limit' : ''}`}>
            {notes.length}/{MAX_LENGTH} characters
          </div>
        </div>

        <button 
          type="submit" 
          className="generate-btn"
          disabled={isLoading || !notes.trim()}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              <span>Generating...</span>
            </>
          ) : 'Generate Flashcards'}
        </button>
      </form>

      {isLoading && (
        <div className="loading-indicator" aria-live="polite">
          <p>Analyzing your notes and creating flashcards...</p>
        </div>
      )}
    </div>
  );
};

export default NotesInputForm;
