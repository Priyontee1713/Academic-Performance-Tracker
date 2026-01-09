import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-container">
        {/* Tracker Portion (Left) */}
        <div className="side tracker-side">
          <h1>Tracker</h1>
          <p className="subtitle">Monitor your performance</p>
          <button className="home-btn">Go to Tracker</button>
        </div>

        {/* Planner Portion (Right) */}
        <div className="side planner-side">
          <h1>Planner</h1>
          <p className="subtitle">Organize your schedule</p>
          <button className="home-btn">Go to Planner</button>
        </div>
      </div>
    </div>
  );
}

export default Home;