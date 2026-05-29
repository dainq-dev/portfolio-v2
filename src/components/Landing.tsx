import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import resume from "../../docs/resume.json";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              NGUYEN QUOC
              <br />
              <span>DAI</span>
            </h1>
            {/* <h2 style={{marginTop:20}}>But you can call me</h2>
            <h1>
              Eric
              <br />
              <span>Nguyen</span>
            </h1> */}
          </div>
          
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Developer</div>
              <div className="landing-h2-2">{resume.personal.role}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{resume.personal.role}</div>
              <div className="landing-h2-info-1">Full-stack</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
