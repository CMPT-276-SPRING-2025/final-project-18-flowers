import "./About.css";

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
        We are a team of passionate student developers and designers who understand the challenges of planning group activities. 
        We’ve created 
        SquadUp to help people like you spend less time planning and more time enjoying life with friends.
      </p>

      <div className="team-images">
        <div className="team-member">
          <div className="image-container">
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
