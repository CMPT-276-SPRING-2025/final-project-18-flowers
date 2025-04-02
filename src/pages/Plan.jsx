import { useState, useEffect } from "react";
import { generateContent } from "../components/Model.js";
import HelpPopup from "../components/HelpPopup";
import "./Plan.css";

// Helper function to convert basic markdown to HTML
const convertMarkdown = (text) => {
  // Convert bold markers: **text** -> <strong>text</strong>
  let html = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  
  // Split text into lines
  const lines = html.split("\n").map((line) => line.trim());
  
  // If every line starts with a bullet marker (*), treat it as a list
  if (lines.every((line) => line.startsWith("*"))) {
    const listItems = lines
      .map((line) => `<li>${line.substring(1).trim()}</li>`)
      .join("");
    html = `<ul>${listItems}</ul>`;
  } else {
    // Otherwise, replace newlines with <br>
    html = html.replace(/\n/g, "<br>");
  }
  
  return html;
};

const Plan = () => {
  const [input, setInput] = useState("");    // State for user input
  const [response, setResponse] = useState(""); // State for AI response
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Show popup every time the component mounts
    setShowHelp(true);
  }, []);

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  const handleShowHelp = () => {
    setShowHelp(true);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = `Give suggestions for a hangout based on: "${input}"`;
    const aiResponse = await generateContent(prompt);
    setResponse(aiResponse);
    setInput(""); // Clear input after submission
  };

  // Define a function to clear both input and response states
  const handleClear = () => {
    setInput("");
    setResponse("");
  };

  return (
    <>
      <div className="help-icon" onClick={handleShowHelp}>
        <i className="fas fa-question-circle"></i>
      </div>
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
          {response && (
            <div dangerouslySetInnerHTML={{ __html: convertMarkdown(response) }} />
          )}
        </div>
        {(input.trim() !== "" || response.trim() !== "") && (
          <button onClick={handleClear} className="clear-btn">
            Clear
          </button>
        )}
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
      <HelpPopup 
        isOpen={showHelp}
        onClose={handleCloseHelp}
      />
    </>
  );
};

export default Plan;
