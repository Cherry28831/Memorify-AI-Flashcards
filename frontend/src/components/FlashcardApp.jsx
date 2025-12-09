import React, { useState } from 'react';
import NotesInputForm from './NotesInputForm';
import FlashcardViewer from './FlashcardViewer';

const FlashcardApp = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'https://memorify-ai-flashcards.onrender.com/api/flashcards';

  // Generate flashcards from notes via API call
  const handleGenerateFlashcards = async (notesText) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesText }),
      });      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate flashcards');
      }

      const data = await response.json();

      // Format flashcards with timestamp-based IDs and current review date
      const generatedCards = data.flashcards.map((card, index) => ({
        id: Date.now() + index,
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty || 'Medium',
        nextReview: new Date().toISOString(),
      }));

      setFlashcards(generatedCards);
    } catch (error) {
      console.error('Error:', error.message);
      alert(error.message || 'An error occurred while generating flashcards.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update next review date based on user feedback
  const handleReviewResult = (id, result) => {
    const intervalDays = { hard: 1, medium: 3, easy: 7 }[result] || 1;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, nextReview: nextReviewDate.toISOString() } : card
      )
    );
  };

  // Edit flashcard content
  const handleEditCard = (id, updatedCard) => {
    setFlashcards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updatedCard } : card))
    );
  };

  // Delete flashcard
  const handleDeleteCard = (id) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== id));
  };

  return (
    <div className="flashcard-app">
      {/* Input form to enter notes and generate flashcards */}
      <NotesInputForm 
        onGenerateFlashcards={handleGenerateFlashcards} 
        isLoading={isLoading} 
      />

      {/* Show flashcards if available */}
      {flashcards.length > 0 && (
        <FlashcardViewer
          flashcards={flashcards}
          onReviewResult={handleReviewResult}
          onEdit={handleEditCard}
          onDelete={handleDeleteCard}
        />
      )}
    </div>
  );
};

export default FlashcardApp;
