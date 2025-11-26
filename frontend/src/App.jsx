import React, { useState, useEffect } from 'react';
import axios from 'axios';

import BubbleGraph from './components/BubbleGraph';
import Tutor from './components/Tutor';
import Feedback from './components/Feedback';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

function App() {
  const [graphData, setGraphData] = useState(null);
  const [points, setPoints] = useState([]);
  const [initialPoints, setInitialPoints] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(() => {
    const saved = localStorage.getItem('rangeAppStatistics');
    return saved ? JSON.parse(saved) : { completed: 0, total: 0, successRate: 0 };
  });
  const [lastSubmittedChallengeId, setLastSubmittedChallengeId] = useState(null);
  const [attemptsCount, setAttemptsCount] = useState(0);

  useEffect(() => {
    loadInitialData();
    loadChallenge();
  }, []);

  const loadInitialData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/data/`);
      setGraphData(response.data);
      const initial = response.data.points;
      setInitialPoints(initial);
      setPoints(initial);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const loadChallenge = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/challenge/`);
      setChallenge(response.data);
      setFeedback(null);
      setAttemptsCount(0);
    } catch (error) {
      console.error('Error loading challenge:', error);
    }
  };

  const handlePointUpdate = (updatedPoints) => {
    setPoints(updatedPoints);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/validate/`, {
        points: points,
        challenge: challenge,
      });
      setFeedback(response.data);
      setAttemptsCount(prev => prev + 1);

      const challengeId = challenge?.type + challenge?.value + challenge?.min + challenge?.max;
      if (lastSubmittedChallengeId !== challengeId) {
        const newStats = {
            ...statistics,
            total: statistics.total + 1,
            completed: response.data.is_correct ? statistics.completed + 1 : statistics.completed,
        };
        newStats.successRate = newStats.total > 0
            ? Math.round((newStats.completed / newStats.total) * 100)
            : 0;
        setStatistics(newStats);
        localStorage.setItem('rangeAppStatistics', JSON.stringify(newStats));
        setLastSubmittedChallengeId(challengeId);
      }
    } catch (error) {
      console.error('Error validating:', error);
      setFeedback({
        is_correct: false,
        feedback: 'Error validating your answer. Please try again.',
      });
    }
  };

  const handleNewChallenge = () => {
    loadChallenge();
    loadInitialData();
  };

  const handleReset = () => {
    setPoints(initialPoints);
    setFeedback(null);
  };

  const handleResetStats = () => {
    const resetStats = { completed: 0, total: 0, successRate: 0 };
    setStatistics(resetStats);
    localStorage.setItem('rangeAppStatistics', JSON.stringify(resetStats));
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Range Teaching App</h1>

        <Tutor challenge={challenge} />

        <div className="statistics-dashboard">
          <div className="stat-item">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">{statistics.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{statistics.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Success Rate:</span>
            <span className="stat-value">{statistics.successRate}%</span>
          </div>
          <button className="btn-reset-stats" onClick={handleResetStats} title="Reset Statistics">
            🔄
          </button>
        </div>

        {challenge && (
            <div style={{
                marginBottom: '10px',
                padding: '10px',
                background: '#f8f9fa',
                borderRadius: '6px',
                textAlign: 'center'
            }}>
                <span style={{ fontWeight: 600, color: '#666' }}>
                Attempts: <span style={{ color: '#667eea' }}>{attemptsCount}</span>
                </span>
            </div>
        )}

        {graphData && (
          <BubbleGraph
            graphData={graphData}
            points={points}
            onPointUpdate={handlePointUpdate}
          />
        )}

        <Feedback
          feedback={feedback}
          onNewChallenge={handleNewChallenge}
        />

        <div className="controls">
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
