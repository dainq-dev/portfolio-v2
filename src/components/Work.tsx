import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import resume from "../../docs/resume.json";
import { useLoading } from "../context/LoadingContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Project {
  name: string;
  description: string;
  achievements: string[];
  technologies: string[];
  company: string;
  iframe?: string;
}

const Work = () => {
  const { isLoading } = useLoading();
  // Aggregate all projects from experiences
  const allProjects: Project[] = resume.experience.flatMap((job) =>
    job.projects.map((project) => ({
      ...project,
      company: job.company,
    })),
  );

  useGSAP(() => {
    if (isLoading) return;

    const getScrollAmount = () => {
      const workFlex = document.querySelector(".work-flex") as HTMLElement;
      if (!workFlex) return 0;
      const boxes = workFlex.querySelectorAll(".work-box");
      if (boxes.length === 0) return 0;
      const firstBox = boxes[0] as HTMLElement;
      const lastBox = boxes[boxes.length - 1] as HTMLElement;
      const contentWidth = lastBox.offsetLeft + lastBox.offsetWidth - firstBox.offsetLeft;
      const paddingRight = parseFloat(window.getComputedStyle(workFlex).paddingRight) || 0;
      return contentWidth + paddingRight - window.innerWidth;
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        scrub: true,
        pin: true,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: () => -getScrollAmount(),
      ease: "none",
    });

    // Trigger a layout refresh after all components have finished loading
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
      clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {allProjects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>
                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.company}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies.join(", ")}</p>
                <p
                  className="work-desc"
                  style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}
                >
                  {project.description}
                </p>
              </div>
              <div className="browser-mockup">
                <div className="browser-header">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                  <div className="browser-address-bar">
                    {project.iframe ? (
                      <a href={project.iframe} target="_blank" rel="noopener noreferrer">
                        {project.iframe.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.local`
                    )}
                  </div>
                </div>
                <div className="browser-content">
                  {project.iframe ? (
                    <iframe
                      src={project.iframe}
                      title={project.name}
                      className="work-iframe"
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <WorkImage image="/images/placeholder.webp" alt={project.name} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
