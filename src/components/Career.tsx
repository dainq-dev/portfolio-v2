import "./styles/Career.css";
import resume from "../../docs/resume.json";

const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {resume.experience.map((job, idx) => {
            // Extract the start year from period (e.g. "June 2025 – Present" -> "2025")
            const startYear = job.period.match(/\d{4}/)?.[0] || "2026";
            const isCurrent = job.period.toLowerCase().includes("present");
            const displayYear = isCurrent ? "NOW" : startYear;
            
            // Generate a brief description from the projects
            const description = job.projects.map(p => `${p.name}: ${p.description}`).join(" | ");

            return (
              <div key={idx} className="career-info-box">
                <div className="career-info-in">
                  <div className="career-role">
                    <h4>{job.company}</h4>
                    <h5>{job.role}</h5>
                    <h6>{job.period}</h6>
                  </div>
                  <h3>{displayYear}</h3>
                </div>
                <p>
                  {description.length > 180 ? `${description.slice(0, 180)}...` : description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Career;
