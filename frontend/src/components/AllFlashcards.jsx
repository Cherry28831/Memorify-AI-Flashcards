import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import '../styles/AllFlashcards.css';

const AllFlashcards = ({ sessions, onGoHome, hideHeader = false, onEdit, onDelete, onReorder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCard, setEditingCard] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [draggedCard, setDraggedCard] = useState(null);

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

  const handleEditCard = (card) => {
    setEditingCard(card);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
  };

  const handleSaveEdit = () => {
    if (onEdit && editingCard) {
      onEdit(editingCard.sessionId, editingCard.id, {
        question: editQuestion,
        answer: editAnswer
      });
      setEditingCard(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
  };

  const handleDragStart = (e, card, index) => {
    setDraggedCard({ card, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetCard, targetIndex) => {
    e.preventDefault();
    if (!draggedCard || draggedCard.index === targetIndex) return;

    if (onReorder) {
      onReorder(draggedCard.card.sessionId, draggedCard.index, targetIndex);
    }
    setDraggedCard(null);
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
          {filteredFlashcards.map((card, index) => (
            <div 
              key={`${card.sessionId}-${card.id}`} 
              className="flashcard-item"
              draggable={!editingCard}
              onDragStart={(e) => handleDragStart(e, card, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, card, index)}
            >
              {editingCard?.id === card.id ? (
                <div className="edit-mode">
                  <textarea value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} placeholder="Question" />
                  <textarea value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} placeholder="Answer" />
                  <div className="edit-actions">
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-header">
                    <div className="drag-handle">
                      <GripVertical size={20} />
                    </div>
                    {!hideHeader && (
                      <span className="session-name">{card.sessionTitle}</span>
                    )}
                  </div>
                  <div className="card-content">
                    <div className="question"><strong>Q:</strong> {card.question}</div>
                    <div className="answer"><strong>A:</strong> {card.answer}</div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => handleEditCard(card)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete && onDelete(card.sessionId, card.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFlashcards;
