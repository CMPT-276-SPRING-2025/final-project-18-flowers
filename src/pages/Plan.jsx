import { useState } from "react";
import { generateContent } from "../components/Model";
import HelpPopup from "../components/HelpPopup";
import "./Plan.css";

/**
 * Converts basic markdown in text to HTML.
 * Bold text (marked with **) is converted to <strong> text </strong>.
 * If every line is a bullet (starting with "*"), the text is rendered as an unordered list.
 *
 * @param {string} text - The input text in basic markdown.
 * @returns {string} - The converted HTML string.
 */
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

/**
 * Fetches Ticketmaster events from the Ticketmaster Discovery API.
 * Filters events based on an optional query (activity) and location.
 *
 * @param {string} query - The activity query (keyword).
 * @param {string} location - The city or zip code.
 * @returns {Promise<Array>} - A promise that resolves to an array of event objects.
 */
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

/**
 * Computes the top venues from an array of events.
 * Groups events by the first venue in each event and returns the top three venues.
 *
 * @param {Array} topPlacesEvents - An array of Ticketmaster events fetched solely by location.
 * @returns {Array} - The top three venues with their associated event and count.
 */
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
  // State variables for input and data
  const [input, setInput] = useState(""); // Internal input for processing (cleared after submission)
  const [submittedQuery, setSubmittedQuery] = useState(""); // Saves the submitted activity query for fallback messages
  const [location, setLocation] = useState(""); // Location input field
  const [response, setResponse] = useState(""); // AI-generated suggestions
  const [events, setEvents] = useState([]); // Suggestion events from Ticketmaster
  const [topPlacesEvents, setTopPlacesEvents] = useState([]); // Events fetched solely by location for computing top places
  const [suggestionsGenerated, setSuggestionsGenerated] = useState(false); // Flag indicating that suggestions have been generated
  const [isLoading, setIsLoading] = useState(false); // Loading state flag
  const [showHelp, setShowHelp] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Visible input field value
  const [copiedEventId, setCopiedEventId] = useState(null); // Tracks which event was shared

  /**
   * Handles changes to the input field.
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  /**
   * Shares the event URL using the Clipboard API and shows a copy confirmation.
   *
   * @param {string} url - The event URL to copy.
   * @param {string} eventId - The event ID (used to display confirmation for a specific event).
   */
  const shareEvent = (url, eventId) => {
    navigator.clipboard
      .writeText(url)
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

  /**
   * Handles form submission.
   * Generates suggestions via the AI API and fetches Ticketmaster events based on
   * the activity query and location.
   *
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Capture the activity query from the form field
    const input = e.target.elements.input.value;
    setInputValue(input);
    setSubmittedQuery(input);
    setIsLoading(true);
    try {
      if (!input.trim()) {
        alert("Please enter an activity or interest");
        return;
      }
  
      // Generate AI suggestions
      const prompt = `Give suggestions for a hangout based on: "${input}"`;
      const aiResponse = await generateContent(prompt);
      console.log("AI response:", aiResponse);
      setResponse(aiResponse);
  
      if (location.trim()) {
        // Fetch events using both query and location for suggestions
        const suggestionEventsResult = await fetchTicketmasterEvents(input, location);
        const bookableSuggestionEvents = suggestionEventsResult.filter(
          (event) => event.url
        );
        setEvents(bookableSuggestionEvents.slice(0, 5));
  
        // Fetch events based solely on location for the top places section
        const topEventsResult = await fetchTicketmasterEvents("", location);
        setTopPlacesEvents(topEventsResult);
      }
      setSuggestionsGenerated(true);
    } catch (error) {
      console.error("Submission error:", error);
      setResponse("Error generating suggestions. Please try again.");
    } finally {
      setIsLoading(false);
      setInput(""); // Clear internal input state after submission
    }
  };

  /**
   * Clears all state values to reset the form.
   */
  const handleClear = () => {
    setInput("");
    setLocation("");
    setResponse("");
    setEvents([]);
    setTopPlacesEvents([]);
    setSuggestionsGenerated(false);
    setInputValue("");
    setSubmittedQuery("");
  };

  // Compute top venues based solely on the events fetched by location.
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
        {/* Display suggestion events if available */}
        {events.length > 0 && (
          <div className="eventbrite-events">
            <h3>Local Events in {location} based on your input:</h3>
            {events.map((event) => (
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
                <div className="event-actions">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-link"
                  >
                    View Event
                  </a>
                  <button
                    className="share-btn"
                    onClick={() => shareEvent(event.url, event.id)}
                  >
                    Share Event
                  </button>
                </div>
                {copiedEventId === event.id && (
                  <div className="copy-message">Copied event link to clipboard</div>
                )}
              </div>
            ))}
          </div>
        )}
        {location.trim() && events.length === 0 && suggestionsGenerated && !isLoading && (
          <div className="no-events-message">
            No bookable events found for "{submittedQuery}" in {location} right now.
          </div>
        )}
        {/* Display the Clear button only after suggestions have been generated */}
        {suggestionsGenerated && (
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
      <HelpPopup isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
};

export default Plan;
