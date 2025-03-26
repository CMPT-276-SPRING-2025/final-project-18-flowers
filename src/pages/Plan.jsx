import { useState } from "react";
import { generateContent } from "../components/Model";
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

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = `Give suggestions for a hangout based on: "${input}"`;
    const aiResponse = await generateContent(prompt);
    setResponse(aiResponse);
    setInput(""); // Clear input
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
        {response && (
          // Render the processed HTML. (Caution: only do this if you're confident in the safety of the content.)
          <div dangerouslySetInnerHTML={{ __html: convertMarkdown(response) }} />
        )}
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
