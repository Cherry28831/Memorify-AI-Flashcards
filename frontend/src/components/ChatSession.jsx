import React, { useState, useEffect } from 'react';
import NotesInputForm from './NotesInputForm';
import FlashcardViewer from './FlashcardViewer';
import AllFlashcards from './AllFlashcards';
import '../styles/ChatSession.css';
import jsPDF from 'jspdf';

const ChatSession = ({ sessionId, sessions, onSaveSession, onGoHome }) => {
    const [currentSession, setCurrentSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('input');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [error, setError] = useState(null);
    const [deletionToast, setDeletionToast] = useState(null);

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

        const updated = { ...currentSession, title: trimmedTitle };
        setCurrentSession(updated);
        onSaveSession(updated);
        setIsEditingTitle(false);
    };

    const handleCancelEdit = () => {
        setEditTitle(currentSession.title || '');
        setIsEditingTitle(false);
    };

    const handleGenerateFlashcards = async (notes, fileName) => {
        if (!notes?.trim()) {
            setError('Please enter valid notes text.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/flashcards/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to generate flashcards');
            }

            const data = await res.json();
            const newCards = data.flashcards.map((card, i) => ({
                id: `${Date.now()}-${i}`,
                question: card.question,
                answer: card.answer,
                nextReview: new Date(),
                reviewCount: 0,
                difficulty: 'new'
            }));

            const updated = {
                ...currentSession,
                title: fileName || `Session ${new Date().toLocaleDateString()}`,
                flashcards: [...(currentSession.flashcards || []), ...newCards]
            };

            setCurrentSession(updated);
            onSaveSession(updated);
            setActiveTab('review');
        } catch (err) {
            setError(err.message || 'Failed to generate flashcards');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReviewResult = (id, result) => {
        const updatedCards = currentSession.flashcards.map(card => {
            if (card.id !== id) return card;

            const next = new Date();
            let difficulty = card.difficulty;

            if (result === 'easy') {
                next.setDate(next.getDate() + (card.reviewCount * 2 + 1));
                difficulty = 'mastered';
            } else if (result === 'medium') {
                next.setDate(next.getDate() + 1);
                difficulty = 'learning';
            } else if (result === 'hard') {
                next.setHours(next.getHours() + 4);
                difficulty = 'difficult';
            }

            return {
                ...card,
                nextReview: next,
                reviewCount: card.reviewCount + 1,
                difficulty
            };
        });

        const updated = { ...currentSession, flashcards: updatedCards };
        setCurrentSession(updated);
        onSaveSession(updated);
    };

    const handleEditFlashcard = (id, updatedCard) => {
        const updatedCards = currentSession.flashcards.map(card =>
            card.id === id ? { ...card, ...updatedCard } : card
        );
        const updated = { ...currentSession, flashcards: updatedCards };
        setCurrentSession(updated);
        onSaveSession(updated);
    };

    const handleDeleteFlashcard = (id) => {
        const toDelete = currentSession.flashcards.find(card => card.id === id);
        const remaining = currentSession.flashcards.filter(card => card.id !== id);

        const updated = { ...currentSession, flashcards: remaining };
        setCurrentSession(updated);
        onSaveSession(updated);

        setDeletionToast({
            message: 'Flashcard deleted',
            undo: () => {
                const restored = { ...currentSession, flashcards: [...remaining, toDelete] };
                setCurrentSession(restored);
                onSaveSession(restored);
                setDeletionToast(null);
            }
        });

        setTimeout(() => setDeletionToast(null), 5000);
        if (activeTab === 'review' && remaining.length === 0) setActiveTab('input');
    };

    const handleDownloadAll = () => {
        if (!currentSession?.flashcards?.length) return;

        const doc = new jsPDF();
        const title = currentSession.title || 'Flashcards';
        doc.setFontSize(16);
        doc.text(title, 10, 10);

        let y = 20;

        currentSession.flashcards.forEach((card, i) => {
            const question = `Q${i + 1}: ${card.question}`;
            const answer = `A${i + 1}: ${card.answer}`;

            const qLines = doc.splitTextToSize(question, 180);
            const aLines = doc.splitTextToSize(answer, 180);

            if (y + (qLines.length + aLines.length) * 7 > 280) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(12);
            doc.text(qLines, 10, y);
            y += qLines.length * 7;

            doc.setTextColor(60, 60, 60);
            doc.text(aLines, 10, y);
            y += aLines.length * 7 + 10;

            doc.setTextColor(0, 0, 0);
        });

        doc.save(`${title}.pdf`);
    };

    if (!currentSession) {
        return <div className="chat-session loading"><div className="loading-spinner" /></div>;
    }

    return (
        <div className="chat-session">
            <div className="session-header">
                <button className="back-btn" onClick={onGoHome}>← Back to Home</button>

                <div className="title-section">
                    {isEditingTitle ? (
                        <div className="title-edit">
                            <input
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
                            <button onClick={() => setIsEditingTitle(true)} className="edit-title-btn">✏️ Edit</button>
                        </div>
                    )}
                </div>

                {/* Tabs + Download Button */}
                <div className="session-tabs">
                    {['input', 'review', 'all-cards'].map(tab => (
                        <button
                            key={tab}
                            className={`tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                            disabled={
                                isLoading ||
                                (['review', 'all-cards'].includes(tab) && !currentSession.flashcards.length)
                            }
                        >
                            {tab === 'input' && 'Add Content'}
                            {tab === 'review' && 'Review Cards'}
                            {tab === 'all-cards' && `All Cards (${currentSession.flashcards.length})`}
                        </button>
                    ))}

                    {currentSession.flashcards.length > 0 && (
                        <button
                        className="tab"
                        onClick={handleDownloadAll}
                        style={{ marginLeft: '10px' }}
                    >
                        Download Cards
                    </button>
                    
                    )}
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
                        <AllFlashcards sessions={[currentSession]} hideHeader />
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
