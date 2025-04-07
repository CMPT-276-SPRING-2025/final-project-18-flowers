import { useState } from "react";
import { generateContent } from "../components/Model";
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
  const [input, setInput] = useState("");
  const [location, setLocation] = useState(""); // New location state
  const [response, setResponse] = useState("");
  const [events, setEvents] = useState([]); // Ticketmaster events state
  const [showHelp, setShowHelp] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const fetchTicketmasterEvents = async (query, location) => {
    try {
      const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;
      const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
      
      // Append query parameters to filter events by keyword and location
      if (query) {
        url.searchParams.append("keyword", query);
      }
      if (location) {
        url.searchParams.append("city", location);
      }
      url.searchParams.append("apikey", apiKey);
  
      console.log("Fetching Ticketmaster events from URL:", url.toString());
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error response from Ticketmaster API:", data);
        throw new Error(`Ticketmaster API error: ${response.status}`);
      }
      
      // The events will be in data._embedded.events if available
      const events = data._embedded ? data._embedded.events : [];
      console.log("Fetched Ticketmaster events:", events);
      return events;
    } catch (error) {
      console.error("Error in fetchTicketmasterEvents:", error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!input.trim()) {
        alert("Please enter an activity or interest");
        return;
      }
  
      const prompt = `Give suggestions for a hangout based on: "${input}"`;
      const aiResponse = await generateContent(prompt);
      setResponse(aiResponse);
  
      if (location.trim()) {
        const eventsResult = await fetchTicketmasterEvents(input, location);
        // Filter for events that have a valid booking URL
        const bookableEvents = eventsResult.filter(event => event.url);
        // Limit to at most 5 events
        setEvents(bookableEvents.slice(0, 5));
      }
    } catch (error) {
      console.error("Submission error:", error);
      setResponse("Error generating suggestions. Please try again.");
    } finally {
      setInput(""); // Clear main input
    }
  };

  const handleClear = () => {
    setInput("");
    setLocation("");
    setResponse("");
    setEvents([]);
  };

  // Compute top venues from the fetched Ticketmaster events
  const computeTopPlaces = () => {
    const venuesCount = {};
    events.forEach((event) => {
      if (event.venue && event.venue.name) {
        const venueName = event.venue.name;
        venuesCount[venueName] = (venuesCount[venueName] || 0) + 1;
      }
    });
    const sortedVenues = Object.entries(venuesCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
    return sortedVenues.slice(0, 3);
  };

  const topPlaces = computeTopPlaces();

  return (
    <>
      <div className="help-icon" onClick={() => setShowHelp(true)}>
        <i className="fas fa-question-circle"></i>
      </div>
      <div className="plan">
        <h1>Plan Your Hangout</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Describe an activity or interest"
            className="search-bar"
            value={input}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Enter location (city or zip)"
            className="search-bar"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            Generate Suggestions
          </button>
        </form>
        {/* AI-generated suggestions */}
        {response && (
          <div className="response-box">
            <div dangerouslySetInnerHTML={{ __html: convertMarkdown(response) }} />
          </div>
        )}
        {/* Ticketmaster events */}
        {events.length > 0 && (
          <div className="eventbrite-events">
            <h3>Local Bookable Events in {location} based on your input:</h3>
            {events.map(event => (
              <div key={event.id} className="event-card">
                <h4>{event.name ? event.name : "Event"}</h4>
                {event.venue && event.venue.name && <p>📍 {event.venue.name}</p>}
                <p>
                  {event.dates && event.dates.start && event.dates.start.dateTime 
                    ? new Date(event.dates.start.dateTime).toLocaleDateString()
                    : "Date not available"}
                </p>
                <a 
                  href={event.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="event-link"
                >
                  View Event
                </a>
              </div>
            ))}
          </div>
        )}
        {/* Fallback message if no bookable events */}
        {location.trim() && events.length === 0 && (
          <div className="no-events-message">
            No bookable events found for "{input}" in {location} right now.
          </div>
        )}
        {(input.trim() !== "" || response.trim() !== "") && (
          <button onClick={handleClear} className="clear-btn">
            Clear
          </button>
        )}
        {/* Dynamic Top Places to Hangout */}
        {location.trim() && (
          <div className="top-places">
            <h2>Top Places to Hangout in {location}</h2>
            <div className="place-cards">
              {topPlaces.length > 0 ? (
                topPlaces.map(place => (
                  <div key={place} className="place-card">{place}</div>
                ))
              ) : (
                <div className="place-card">No top places available</div>
              )}
            </div>
          </div>
        )}
      </div>
      <HelpPopup 
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </>
  );
};

export default Plan;
