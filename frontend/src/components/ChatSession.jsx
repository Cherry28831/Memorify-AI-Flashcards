import React, { useState, useEffect } from 'react';
import NotesInputForm from './NotesInputForm';
import FlashcardViewer from './FlashcardViewer';
import AllFlashcards from './AllFlashcards';
import '../styles/ChatSession.css';

const ChatSession = ({ sessionId, sessions, onSaveSession, onGoHome }) => {
    const [currentSession, setCurrentSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('input');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [error, setError] = useState(null);
    const [deletionToast, setDeletionToast] = useState(null);

    // Initialize session when sessionId or sessions change
    useEffect(() => {
        const session = sessions.find(s => s.id === sessionId) || {
            id: sessionId,
            title: '',
            flashcards: [],
            createdAt: Date.now()
        };
        setCurrentSession(session);
        setEditTitle(session.title || '');
    }, [sessionId, sessions]);

    const handleSaveTitle = () => {
        const trimmedTitle = editTitle.trim();
        if (!trimmedTitle) return;

        const updatedSession = { ...currentSession, title: trimmedTitle };
        setCurrentSession(updatedSession);
        onSaveSession(updatedSession);
        setIsEditingTitle(false);
    };

    const handleCancelEdit = () => {
        setEditTitle(currentSession.title || '');
        setIsEditingTitle(false);
    };

    const handleGenerateFlashcards = async (notes, fileName) => {
        if (!notes || typeof notes !== 'string' || !notes.trim()) {
            setError('Please enter valid notes text.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/flashcards/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate flashcards');
            }

            const data = await response.json();

            const newFlashcards = data.flashcards.map((card, index) => ({
                id: `${Date.now()}-${index}`,
                question: card.question,
                answer: card.answer,
                nextReview: new Date(),
                reviewCount: 0,
                difficulty: 'new'
            }));

            const updatedSession = {
                ...currentSession,
                title: fileName || `Session ${new Date().toLocaleDateString()}`,
                flashcards: [...(currentSession.flashcards || []), ...newFlashcards]
            };

            setCurrentSession(updatedSession);
            onSaveSession(updatedSession);
            setActiveTab('review');
        } catch (err) {
            console.error("Flashcard generation error:", err);
            setError(err.message || 'Failed to generate flashcards');
        } finally {
            setIsLoading(false);
        }
    };

    // Update flashcard after user reviews it
    const handleReviewResult = (id, result) => {
        const updatedFlashcards = currentSession.flashcards.map(card => {
            if (card.id !== id) return card;

            const nextDate = new Date();
            let difficulty = card.difficulty;

            switch (result) {
                case 'easy':
                    nextDate.setDate(nextDate.getDate() + (card.reviewCount * 2 + 1));
                    difficulty = 'mastered';
                    break;
                case 'medium':
                    nextDate.setDate(nextDate.getDate() + 1);
                    difficulty = 'learning';
                    break;
                case 'hard':
                    nextDate.setHours(nextDate.getHours() + 4);
                    difficulty = 'difficult';
                    break;
                default:
                    break;
            }

            return {
                ...card,
                nextReview: nextDate,
                reviewCount: card.reviewCount + 1,
                difficulty
            };
        });

        const updatedSession = { ...currentSession, flashcards: updatedFlashcards };
        setCurrentSession(updatedSession);
        onSaveSession(updatedSession);
    };

    // Edit a flashcard manually
    const handleEditFlashcard = (id, updatedCard) => {
        const updatedFlashcards = currentSession.flashcards.map(card =>
            card.id === id ? { ...card, ...updatedCard } : card
        );

        const updatedSession = { ...currentSession, flashcards: updatedFlashcards };
        setCurrentSession(updatedSession);
        onSaveSession(updatedSession);
    };

    // Delete a flashcard with undo option
    const handleDeleteFlashcard = (id) => {
        const cardToDelete = currentSession.flashcards.find(card => card.id === id);
        const updatedFlashcards = currentSession.flashcards.filter(card => card.id !== id);

        const updatedSession = {
            ...currentSession,
            flashcards: updatedFlashcards
        };

        setCurrentSession(updatedSession);
        onSaveSession(updatedSession);

        setDeletionToast({
            message: 'Flashcard deleted',
            undo: () => {
                const restoredFlashcards = [...updatedFlashcards, cardToDelete];
                const restoredSession = { ...currentSession, flashcards: restoredFlashcards };
                setCurrentSession(restoredSession);
                onSaveSession(restoredSession);
                setDeletionToast(null);
            }
        });

        setTimeout(() => setDeletionToast(null), 5000);

        if (activeTab === 'review' && updatedFlashcards.length === 0) {
            setActiveTab('input');
        }
    };

    if (!currentSession) {
        return (
            <div className="chat-session loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="chat-session">
            <div className="session-header">
                <button className="back-btn" onClick={onGoHome}>← Back to Home</button>

                <div className="title-section">
                    {isEditingTitle ? (
                        <div className="title-edit">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="title-input"
                                placeholder="Enter session name"
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                                autoFocus
                            />
                            <div className="title-actions">
                                <button onClick={handleSaveTitle} className="save-btn">Save</button>
                                <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="title-display">
                            <h2>{currentSession.title || 'New Session'}</h2>
                            <button 
                                onClick={() => setIsEditingTitle(true)} 
                                className="edit-title-btn"
                                aria-label="Edit session title"
                            >
                                ✏️ Edit
                            </button>
                        </div>
                    )}
                </div>

                <div className="session-tabs">
                    <button 
                        className={`tab ${activeTab === 'input' ? 'active' : ''}`}
                        onClick={() => setActiveTab('input')}
                        disabled={isLoading}
                    >
                        Add Content
                    </button>
                    <button 
                        className={`tab ${activeTab === 'review' ? 'active' : ''}`}
                        onClick={() => setActiveTab('review')}
                        disabled={isLoading || currentSession.flashcards.length === 0}
                    >
                        Review Cards
                    </button>
                    <button 
                        className={`tab ${activeTab === 'all-cards' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all-cards')}
                        disabled={isLoading || currentSession.flashcards.length === 0}
                    >
                        All Cards ({currentSession.flashcards.length})
                    </button>
                </div>
            </div>

            <div className="session-content">
                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={() => setError(null)} className="dismiss-btn">×</button>
                    </div>
                )}

                {activeTab === 'input' && (
                    <NotesInputForm 
                        onGenerateFlashcards={handleGenerateFlashcards} 
                        isLoading={isLoading}
                    />
                )}

                {activeTab === 'review' && (
                    <FlashcardViewer 
                        flashcards={currentSession.flashcards}
                        onReviewResult={handleReviewResult}
                        onEdit={handleEditFlashcard}
                        onDelete={handleDeleteFlashcard}
                    />
                )}

                {activeTab === 'all-cards' && (
                    <div className="session-all-cards">
                        <AllFlashcards 
                            sessions={[currentSession]}
                            hideHeader={true}
                        />
                    </div>
                )}
            </div>

            {deletionToast && (
                <div className="deletion-toast">
                    <span>{deletionToast.message}</span>
                    <button onClick={deletionToast.undo} className="undo-btn">Undo</button>
                    <button onClick={() => setDeletionToast(null)} className="dismiss-toast">×</button>
                </div>
            )}
        </div>
    );
};

export default ChatSession;
