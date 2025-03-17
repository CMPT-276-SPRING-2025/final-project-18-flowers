import { useState } from "react";
import "./Plan.css";

const Plan = () => {
  const [input, setInput] = useState(""); // State to store user input
  const [response, setResponse] = useState(""); // State to store AI response

  const handleInputChange = (e) => {
    setInput(e.target.value); // Update input state as the user types
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    // Simulate an AI response (replace this with API call later)
    setResponse(`Here are some suggestions based on "${input}": 
    1. Visit a local park
    2. Check out a comedy show
    3. Try a new cafe`);
    setInput(""); // Clear the input field
  };

  return (
    <div className="plan">
      <h1>Plan Your Hangout</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for events or activities"
          className="search-bar"
          value={input}
          onChange={handleInputChange}
        />
      </form>
      <div className="response-box">
        {response && <p>{response}</p>} {/* Display AI response */}
      </div>
      <div className="top-places">
        <h2>Top Places to Hangout</h2>
        <div className="place-cards">
          <div className="place-card">Eventbrite</div>
          <div className="place-card">Spots</div>
          <div className="place-card">Cafes</div>
          <div className="place-card">Parks</div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
