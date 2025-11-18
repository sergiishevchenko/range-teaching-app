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
  const [challenge, setChallenge] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
    loadChallenge();
  }, []);

  const loadInitialData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/data/`);
      setGraphData(response.data);
      setPoints(response.data.points);
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
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Answer
          </button>
          <button className="btn btn-secondary" onClick={handleNewChallenge}>
            New Challenge
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
