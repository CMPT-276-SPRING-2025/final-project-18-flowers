import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-content">
        <h1>Your Own AI Hangout Planner</h1>
        <p>
          SquadUp is here to make planning hangouts with friends easier than
          ever. Whether you're looking for events, meeting spots, or ways to
          split costs, SquadUp has you covered. Let us handle the planning so
          you can focus on having fun with your squad!
        </p>
        <button onClick={() => navigate("/plan")} className="plan-button">
          Start Planning
        </button>
      </div>
      <div className="home-image">
        <img src="plane.png" alt="Plane" />
      </div>
    </div>
  );
};

export default Home;
