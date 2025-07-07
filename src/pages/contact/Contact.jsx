import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer/footer";
import "./Contact.scss";

const Contact = ({ isLoggedIn = false }) => {
  return (
    <div className="contact-page">
      {isLoggedIn ? <Navbar /> : null}

      <div className="contact-container">
        {!isLoggedIn && (
          <button className="buttonbleu" style={{ marginBottom: "20px" }}>
            Se connecter
          </button>
        )}

        <div className="logo">
          <img src="/images/logo.png" alt="La Pince" />
        </div>

        <div className="contact-info">
          <h3>Nous contacter :</h3>
          <p>lapincecontactprincipal@gmail.com</p>

          <h4>Adresse :</h4>
          <p>18 rue de la méditerranée 75000 Paris</p>
        </div>

        <div className="social-section">
          <h3>Retrouver nous sur :</h3>

          <div className="social-grid">
            <a href="#" className="social-link">
              <img src="/images/linkedin.png" alt="LinkedIn" />
              <span>lapincelinkedin</span>
            </a>
            <a href="#" className="social-link">
              <img src="/images/facebook.png" alt="Facebook" />
              <span>lapincefacebook</span>
            </a>
            <a href="#" className="social-link">
              <img src="/images/twitter.png" alt="Twitter" />
              <span>lapinceX</span>
            </a>
            <a href="#" className="social-link">
              <img src="/images/instagram.png" alt="Instagram" />
              <span>lapinceinsta</span>
            </a>
            <a href="#" className="social-link">
              <img src="/images/tiktok.png" alt="TikTok" />
              <span>lapincetiktok</span>
            </a>
            <a href="#" className="social-link">
              <img src="/images/youtube.png" alt="YouTube" />
              <span>solutionslapince</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
