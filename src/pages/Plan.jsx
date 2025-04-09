import { useState } from "react";
import { generateContent } from "../components/Model";
import HelpPopup from "../components/HelpPopup";
import "./Plan.css";

// Helper function to convert basic markdown to HTML
const convertMarkdown = (text) => {
  let html = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const lines = html.split("\n").map((line) => line.trim());
  if (lines.every((line) => line.startsWith("*"))) {
    const listItems = lines.map((line) => `<li>${line.substring(1).trim()}</li>`).join("");
    html = `<ul>${listItems}</ul>`;
  } else {
    html = html.replace(/\n/g, "<br>");
  }
  return html;
};

export const fetchTicketmasterEvents = async (query, location) => {
  try {
    const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;
    const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
    
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
    
    const events = data._embedded ? data._embedded.events : [];
    console.log("Fetched Ticketmaster events:", events);
    return events;
  } catch (error) {
    console.error("Error in fetchTicketmasterEvents:", error);
    return [];
  }
};

export const computeTopPlaces = (topPlacesEvents) => {
  const venuesMap = {};
  topPlacesEvents.forEach((event) => {
    if (
      event._embedded &&
      event._embedded.venues &&
      event._embedded.venues.length > 0
    ) {
      const venueName = event._embedded.venues[0].name;
      if (venueName) {
        if (!venuesMap[venueName]) {
          venuesMap[venueName] = { count: 1, event };
        } else {
          venuesMap[venueName].count += 1;
        }
      }
    }
  });
  const sortedVenues = Object.entries(venuesMap)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([venueName, info]) => ({
      venueName,
      event: info.event,
      count: info.count,
    }));
  return sortedVenues.slice(0, 3);
};

const Plan = () => {
  const [input, setInput] = useState("");
  const [location, setLocation] = useState(""); // Location input
  const [response, setResponse] = useState("");
  const [events, setEvents] = useState([]); // Events for suggestions
  const [topPlacesEvents, setTopPlacesEvents] = useState([]); // For top places computation
  const [suggestionsGenerated, setSuggestionsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [inputValue, setInputValue] = useState(""); // For the text field value
  const [copiedEventId, setCopiedEventId] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const shareEvent = (url, eventId) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopiedEventId(eventId);
        setTimeout(() => {
          setCopiedEventId(null);
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy event URL:", err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Capture the input from the form named "input"
    const input = e.target.elements.input.value;
    setInputValue(input);
    setIsLoading(true);
    try {
      if (!input.trim()) {
        alert("Please enter an activity or interest");
        return;
      }
  
      const prompt = `Give suggestions for a hangout based on: "${input}"`;
      const aiResponse = await generateContent(prompt);
      setResponse(aiResponse);
  
      if (location.trim()) {
        // Fetch events using both the query and location for suggestions
        const suggestionEventsResult = await fetchTicketmasterEvents(input, location);
        const bookableSuggestionEvents = suggestionEventsResult.filter(
          (event) => event.url
        );
        setEvents(bookableSuggestionEvents.slice(0, 5));
  
        // Fetch events based solely on location for the "Top Places" section
        const topEventsResult = await fetchTicketmasterEvents("", location);
        setTopPlacesEvents(topEventsResult);
      }
      setSuggestionsGenerated(true);
    } catch (error) {
      console.error("Submission error:", error);
      setResponse("Error generating suggestions. Please try again.");
    } finally {
      setIsLoading(false);
      setInput(""); // Clear main input field after submission
    }
  };

  const handleClear = () => {
    setInput("");
    setLocation("");
    setResponse("");
    setEvents([]);
    setTopPlacesEvents([]);
    setSuggestionsGenerated(false);
    setInputValue("");
  };

  const topPlaces = computeTopPlaces(topPlacesEvents);

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
            name="input"
            placeholder="Describe an activity or interest"
            className="search-bar"
            value={inputValue}
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
        {isLoading && (
          <div className="loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {response && (
          <div className="response-box">
            <div dangerouslySetInnerHTML={{ __html: convertMarkdown(response) }} />
          </div>
        )}
        {/* Display suggestions (up to 5 events) */}
        {events.length > 0 && (
          <div className="eventbrite-events">
            <h3>Local Events in {location} based on your input:</h3>
            {events.map(event => (
              <div key={event.id} className="event-card">
                <h4>{event.name ? event.name : "Event"}</h4>
                {event._embedded &&
                  event._embedded.venues &&
                  event._embedded.venues.length > 0 && (
                    <p>📍 {event._embedded.venues[0].name}</p>
                )}
                <p>
                  {event.dates &&
                  event.dates.start &&
                  event.dates.start.dateTime 
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
                <button className="share-btn" onClick={() => shareEvent(event.url, event.id)}>
                  Share Event
                </button>
                {copiedEventId === event.id && (
                  <div className="copy-message">Copied event link to clipboard</div>
                )}
              </div>
            ))}
          </div>
        )}
        {location.trim() && events.length === 0 && suggestionsGenerated && !isLoading && (
          <div className="no-events-message">
            No bookable events found for "{input}" in {location} right now.
          </div>
        )}
        {(input.trim() !== "" || response.trim() !== "") && (
          <button onClick={handleClear} className="clear-btn">
            Clear
          </button>
        )}
        {/* Dynamic Top Places to Hangout shown only if suggestions generated */}
        {suggestionsGenerated && (
          <div className="top-places">
            <h2>
              {location.trim() 
                ? `Top Places to Hangout in ${location}`
                : "Enter your location to see our selection of top places to hangout"}
            </h2>
            {location.trim() && (
              <div className="place-cards">
                {topPlaces.length > 0 ? (
                  topPlaces.map(({ venueName, event }) => (
                    <a
                      key={venueName}
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="place-card"
                    >
                      {event.images && event.images.length > 0 ? (
                        <img
                          src={event.images[0].url}
                          alt={venueName}
                          className="venue-image"
                        />
                      ) : (
                        <div className="venue-placeholder">No Image</div>
                      )}
                      <div className="venue-name">{venueName}</div>
                    </a>
                  ))
                ) : (
                  <div className="place-card">No top places available</div>
                )}
              </div>
            )}
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
