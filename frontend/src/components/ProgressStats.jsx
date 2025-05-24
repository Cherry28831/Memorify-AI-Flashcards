import React from 'react';
import '../styles/ProgressStats.css';

const ProgressStats = ({ flashcards }) => {
  // Calculate statistics
  const total = flashcards.length;
  const now = new Date();
  const dueToday = flashcards.filter(card => new Date(card.nextReview) <= now).length;
  const dueTomorrow = flashcards.filter(card => {
    const reviewDate = new Date(card.nextReview);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return reviewDate > now && reviewDate <= tomorrow;
  }).length;
  
  const masteredCards = flashcards.filter(card => card.difficulty === 'mastered').length;
  const learningCards = flashcards.filter(card => card.difficulty === 'learning').length;
  const difficultCards = flashcards.filter(card => card.difficulty === 'difficult').length;
  const newCards = flashcards.filter(card => card.difficulty === 'new').length;
  
  const streakDays = Math.floor(Math.random() * 10) + 1; // Simulated streak for demo
  const reviewedToday = Math.floor(Math.random() * 15); // Simulated reviews for demo

  return (
    <div className="progress-container">
      <h2>Your Study Progress</h2>
      
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Cards</h3>
          <span className="stat-value">{total}</span>
        </div>
        
        <div className="stat-card">
          <h3>Due Today</h3>
          <span className="stat-value">{dueToday}</span>
        </div>
        
        <div className="stat-card">
          <h3>Due Tomorrow</h3>
          <span className="stat-value">{dueTomorrow}</span>
        </div>
        
        <div className="stat-card">
          <h3>Studied Today</h3>
          <span className="stat-value">{reviewedToday}</span>
        </div>
      </div>
      
      <div className="progress-section">
        <h3>Mastery Progress</h3>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill mastered" 
              style={{ width: `${(masteredCards/total) * 100}%` }}
              title={`Mastered: ${masteredCards}`}
            />
            <div 
              className="progress-fill learning" 
              style={{ width: `${(learningCards/total) * 100}%` }}
              title={`Learning: ${learningCards}`}
            />
            <div 
              className="progress-fill difficult" 
              style={{ width: `${(difficultCards/total) * 100}%` }}
              title={`Difficult: ${difficultCards}`}
            />
            <div 
              className="progress-fill new" 
              style={{ width: `${(newCards/total) * 100}%` }}
              title={`New: ${newCards}`}
            />
          </div>
        </div>
        <div className="progress-legend">
          <div className="legend-item">
            <div className="legend-color mastered"></div>
            <span>Mastered ({masteredCards})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color learning"></div>
            <span>Learning ({learningCards})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color difficult"></div>
            <span>Difficult ({difficultCards})</span>
          </div>
          <div className="legend-item">
            <div className="legend-color new"></div>
            <span>New ({newCards})</span>
          </div>
        </div>
      </div>
      
      <div className="streak-section">
        <h3>Study Streak</h3>
        <div className="streak-display">
          <span className="streak-count">{streakDays}</span>
          <span className="streak-label">days</span>
        </div>
        <p>Keep studying daily to maintain your streak!</p>
      </div>
    </div>
  );
};

export default ProgressStats;