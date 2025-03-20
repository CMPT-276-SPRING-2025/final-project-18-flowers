import { useState } from "react";
import { generateContent } from "../components/Model"; // adjust the path if necessary
import "./Plan.css";

const Plan = () => {
  const [input, setInput] = useState("");    // State for user input
  const [response, setResponse] = useState(""); // State for AI response

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Build a prompt for the AI (you can adjust this string as needed)
    const prompt = `Give suggestions for a hangout based on: "${input}"`;
    // Await the generated content from the AI
    const aiResponse = await generateContent(prompt);
    setResponse(aiResponse);
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
        {response && <p>{response}</p>}
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