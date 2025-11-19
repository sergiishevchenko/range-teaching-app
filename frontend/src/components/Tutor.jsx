import React from 'react';

import styles from './Tutor.module.css';


function Tutor({ challenge }) {
  return (
    <div className={styles.tutor}>
      <div className={styles['tutor-section']}>
        <h2>📚 What is Range?</h2>
        <p className={styles.definition}>
          <strong>Range</strong> is the set of possible output values, which are shown on the y-axis.
          It represents the difference between the highest and lowest values in your data.{' '}
          <a href="https://courses.lumenlearning.com/waymakercollegealgebra/chapter/find-domain-and-range-from-a-graph/" target="_blank" rel="noopener noreferrer">
            Learn more about domain and range from graphs
          </a>
        </p>
      </div>

      {challenge && (
        <div className={`${styles['tutor-section']} ${styles['challenge-section']}`}>
          <h2>🎯 Your Challenge</h2>
          <p className={styles['challenge-text']}>{challenge.description}</p>
          <div className={styles['challenge-details']}>
            {challenge.type === 'less_than' && (
              <span>Target: Range &lt; {challenge.value}</span>
            )}
            {challenge.type === 'greater_than' && (
              <span>Target: Range &gt; {challenge.value}</span>
            )}
            {challenge.type === 'between' && (
              <span>Target: Range between {challenge.min} and {challenge.max}</span>
            )}
            {challenge.type === 'exact' && (
              <span>Target: Range from {challenge.min} to {challenge.max}</span>
            )}
          </div>
        </div>
      )}

      <div className={`${styles['tutor-section']} ${styles.instructions}`}>
        <h2>💡 Instructions</h2>
        <ul>
          <li>Click and drag the bubbles to move them along the y-axis (or x-axis)</li>
          <li>Adjust the points to achieve the target range</li>
          <li>Click "Submit Answer" to check if you're correct</li>
          <li>The range is calculated from the minimum to maximum y-values</li>
        </ul>
      </div>
    </div>
  );
}

export default Tutor;
