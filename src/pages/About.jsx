import "./About.css";

// Import Clifton's image
import CliftonImage from "../images/Clifton.jpg";

const About = () => {
  return (
    <div className="about">
      <h1>What is SquadUp?</h1>
      <p>
        SquadUp is an innovative hangout planner designed to simplify the process of organizing group activities. 
        Whether you're planning a casual meetup with friends or coordinating a larger event, SquadUp helps you 
        find activities, suggest meeting spots, and align schedules effortlessly. Our goal is to eliminate the 
        hassle of planning so you can focus on enjoying quality time with your squad.
      </p>

      <h2>Our Mission</h2>
      <p>
        We aim to solve the common problem of coordinating plans among groups, especially for teens and young adults 
        who often struggle to align schedules and interests. By leveraging AI and APIs, SquadUp provides personalized 
        event suggestions, real-time meetup coordination, and seamless expense tracking, making group hangouts 
        stress-free and fun.
      </p>

      <h2>Who Are We?</h2>
      <p>
        We are a team of passionate developers and designers who understand the challenges of planning group activities. 
        Our team includes Krish Sonvane, Erik Schaufele, Clifton Tan, and Nevin Seikhon. Together, we’ve created 
        SquadUp to help people like you spend less time planning and more time enjoying life with friends.
      </p>

      <div className="team-images">
        <div className="team-member">
          <div className="image-container">
            <img src={CliftonImage} alt="Clifton Tan" />
          </div>
          <p>Clifton Tan</p>
          <a href="https://github.com/Cliftan">GitHub</a>
          <a href="https://linkedin.com/in/Cliftan">LinkedIn</a>
        </div>
        <div className="team-member">
          <div className="image-container">
            <img src="" alt="Krish" />
          </div>
          <p>Krish</p>
          <a href="https://github.com/krishsonvane14">GitHub</a>
          <a href="https://www.linkedin.com/in/krish-sonvane-89109b294/">LinkedIn</a>
        </div>
        <div className="team-member">
          <div className="image-container">
            <img src="" alt="Nevin" />
          </div>
          <p>Nevin</p>
          <a href="https://github.com/Cliftan">GitHub</a>
          <a href="https://linkedin.com/in/Cliftan">LinkedIn</a>
        </div>
        <div className="team-member">
          <div className="image-container">
            <img src="src/images/Erik.png" alt="Erik" />
          </div>
          <p>Erik</p>
          <a href="https://github.com/eriks-23">GitHub</a>
          <a href="https://www.linkedin.com/in/erik-schaufele-23b0b1311/">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default About;