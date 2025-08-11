import React from "react";
import {
  FacebookShareButton, TwitterShareButton, LinkedinShareButton,
  FacebookIcon, TwitterIcon, LinkedinIcon
} from "react-share";

const Home = () => {
  const shareUrl = "https://memorify-ai-flashcards.vercel.app/";
  const title = "Check out Memorify – AI-powered flashcards for smarter study!";

  return (
    <div>
      <header>
        <h1>Memorify — AI Flashcards for Smarter Learning</h1>
        <p>
          Welcome to Memorify, the ultimate AI-powered tool to convert your study notes into flashcards instantly.
        </p>
      </header>

      <main>
        <section>
          <h2>Why Memorify?</h2>
          <p>
            Memorify helps students quickly generate interactive flashcards from any text-based study material...
          </p>
        </section>

        <section>
          <h2>Features</h2>
          <ul>
            <li>Instant AI-generated flashcards</li>
            <li>Cross-device syncing</li>
            <li>Simple, user-friendly interface</li>
            <li>Free to use</li>
          </ul>
        </section>

        <section>
          <h2>Learn More</h2>
          <p>
            Visit our <a href="/features">Features</a> and <a href="/about">About</a> pages.
          </p>
          <p>
            Check study tips at <a href="https://www.educationcorner.com/" target="_blank" rel="noopener noreferrer">Education Corner</a>.
          </p>
        </section>

        <section>
          <h2>Share Memorify</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <FacebookShareButton url={shareUrl} quote={title}><FacebookIcon size={40} round /></FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}><TwitterIcon size={40} round /></TwitterShareButton>
            <LinkedinShareButton url={shareUrl}><LinkedinIcon size={40} round /></LinkedinShareButton>
          </div>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Memorify. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
