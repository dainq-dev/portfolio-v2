import "./styles/About.css";
import resume from "../../docs/resume.json";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          {resume.summary}
        </p>
      </div>
    </div>
  );
};

export default About;
