import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import resume from "../../docs/resume.json";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${resume.personal.email}`} data-cursor="disable">
                {resume.personal.email}
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href={`tel:${resume.personal.phone.replace(/\s+/g, '')}`} data-cursor="disable">
                {resume.personal.phone}
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/dainq-dev"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/nqd-020199hcm/"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>{resume.personal.name}</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
