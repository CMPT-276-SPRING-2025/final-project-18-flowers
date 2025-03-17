import "./Plan.css";

const Plan = () => {
  return (
    <div className="plan">
      <h1>Plan Your Hangout</h1>
      <input
        type="text"
        placeholder="Search for events or activities"
        className="search-bar"
      />
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
