import React from 'react';

import styles from './Feedback.module.css';

function Feedback({ feedback, onNewChallenge }) {
  if (!feedback) return null;

  return (
    <div className={`${styles['feedback-section']} ${feedback.is_correct ? styles.correct : styles.incorrect}`}>
      <h2>{feedback.is_correct ? '✅ Correct!' : '❌ Try Again'}</h2>
      <p className={styles['feedback-text']}>{feedback.feedback}</p>
      {feedback.current_range && (
        <div className={styles['range-info']}>
          <p>Current Range: {feedback.current_range.range.toFixed(0)}</p>
          <p>Min: {feedback.current_range.min.toFixed(0)}, Max: {feedback.current_range.max.toFixed(0)}</p>
        </div>
      )}
      {feedback.is_correct && (
        <button className={styles['btn-new-challenge']} onClick={onNewChallenge}>
          Try Another Challenge
        </button>
      )}
    </div>
  );
}

export default Feedback;
