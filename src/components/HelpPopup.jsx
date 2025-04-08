import React from 'react';
import './HelpPopup.css';

const HelpPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="help-popup-overlay">
      <div className="help-popup-content">
        <h2>How to Use SquadUp</h2>
        
        <div className="help-step">
          <img src="/final-project-18-flowers/search.png" alt="Search interface" className="help-image" />
          <p>1. Use the search bar to find activities or events in the location you're interested in</p>
        </div>

        <div className="help-step">
          <img src="/final-project-18-flowers/result.png" alt="AI response step" className="help-image" />
          <p>2. Get personalized suggestions from our AI based on your search</p>
        </div>

        <div className="help-step">
          <img src="/final-project-18-flowers/ticketmaster.png" alt="Categories step" className="help-image" />
          <p>3. Browse through different categories like events, spots, cafes, and parks</p>
        </div>

        <div className="help-buttons">
          <button onClick={onClose} className="close-btn">Got it!</button>
        </div>
      </div>
    </div>
  );
};

export default HelpPopup; 