import { useEffect } from "react";
import "./styles/WhatIDo.css";
import resume from "../../docs/resume.json";
import { FaCode, FaServer, FaCloud, FaBrain } from "react-icons/fa6";

const WhatIDo = () => {
  // Categorize skills cleanly from resume.json
  const categories = [
    {
      title: "Frontend & Languages",
      icon: <FaCode className="skill-icon-fe" />,
      skills: [...resume.skills.Languages, ...resume.skills.Frontend],
      color: "#c2a4ff",
    },
    {
      title: "Backend & Databases",
      icon: <FaServer className="skill-icon-be" />,
      skills: [...resume.skills.Backend, ...resume.skills.Databases, ...resume.skills.Others],
      color: "#8dd4ff",
    },
    {
      title: "DevOps, Cloud & Testing",
      icon: <FaCloud className="skill-icon-cloud" />,
      skills: [...resume.skills.DevOpsCloud, ...resume.skills.TestingQA],
      color: "#ff8da1",
    },
    {
      title: "AI & Agentic Systems",
      icon: <FaBrain className="skill-icon-ai" />,
      skills: [...resume.skills.AI_LLM, ...resume.skills.AITooling],
      color: "#ffc88d",
    }
  ];

  return (
    <div className="whatIDO">
      <div className="what-layout-container">
        {/* Left Column: Title Section */}
        <div className="what-left-panel">
          <h2 className="title">
            W<span className="hat-h2">HAT</span>
            <div>
              I<span className="do-h2"> DO</span>
            </div>
          </h2>
          <p className="what-subtitle">
            Leveraging modern tech stacks, cloud architecture, and cutting-edge Agentic AI workflows to deliver highly performant, scalable digital platforms.
          </p>
        </div>

        {/* Right Column: Beautiful Fully Visible Skills Grid */}
        <div className="what-right-panel">
          <div className="skills-grid">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="skill-card-premium"
                style={{ "--accent-glow": cat.color } as React.CSSProperties}
              >
                <div className="skill-card-header">
                  {cat.icon}
                  <h3>{cat.title}</h3>
                </div>
                <div className="skill-card-tags">
                  {cat.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="skill-badge-premium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
