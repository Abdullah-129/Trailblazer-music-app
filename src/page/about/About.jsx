import React, { useEffect } from "react";
import "./About.css";
import { FaGithub } from "react-icons/fa";

const About = () => {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    document.title = "About • Okv Music";
  }, []);

  return (
    <section className="container about-container">
      <div className="about-wrapper">
        <div className="about-header-wrapper">
          <img src="/logo.png" alt="okv-music" />
        </div>
        <div className="about-content-wrapper">
          <p>
          TRAILBLAZER is a university project that serves as a music app developed using React.js, incorporating the YouTube API to enhance its functionality and user experience. ❤️
          </p>
        </div>

        <div className="about-footer">
          <small>
            Copyright © 2023-{currentYear} TRAILBLAZER. All Rights Reserved.
          </small>
        
        </div>
      </div>
    </section>
  );
};

export default About;
