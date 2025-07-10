import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/footer";
import "./Contact.scss";
import "../../global.scss";

const Contact = () => {
  return (

    <div className="contact-page">
      <Navbar />
      <div className="contact-container">
        
        <div className="contact-sections">
          <div className="contact-info">
            <h3>Nous contacter :</h3>
            <div
              className="contact-button"
              onClick={() => {
                try {
                  window.location.href = 'mailto:lapincecontactprincipal@gmail.com';
                } catch (error) {
                  const link = document.createElement('a');
                  link.href = 'mailto:lapincecontactprincipal@gmail.com';
                  link.click();
                }
              }}
              style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '10px', marginBottom: '10px' }}
              title="Envoyer un mail"
            >
              {/* Icône mail SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                stroke="#3e528d"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                className="contact-icon"
                style={{
                  width: 'clamp(24px, 4vw, 32px)',
                  height: 'clamp(24px, 4vw, 32px)'
                }}
              >
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span style={{ color: '#3e528d', fontWeight: 600, fontSize: 16 }}>
                lapincecontactprincipal@gmail.com
              </span>
            </div>
          </div>

          <div className="social-section">
            <h3>Retrouver nous sur :</h3>

            <div className="social-grid">
              <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                {/* LinkedIn SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
                  <title>LinkedIn</title>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.358V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.369-1.849 3.602 0 4.267 2.368 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z" />
                </svg>
                <span>lapincelinkedin</span>
              </a>
              <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
                {/* Facebook SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="Facebook">
                  <title>Facebook</title>
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
                <span>lapincefacebook</span>
              </a>
              <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                {/* Twitter SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="Twitter">
                  <title>Twitter</title>
                  <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.717 0-4.924 2.206-4.924 4.924 0 .386.044.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.724-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z" />
                </svg>
                <span>lapinceX</span>
              </a>
              <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
                {/* Instagram SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="Instagram">
                  <title>Instagram</title>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.976 1.246 2.243 1.308 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.332 2.633-1.308 3.608-.976.975-2.243 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.332-3.608-1.308-.975-.976-1.246-2.243-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608C4.516 2.565 5.783 2.295 7.149 2.233 8.415 2.175 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.388 3.678 1.37c-.98.98-1.24 2.092-1.298 3.373C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.613.058 1.281.318 2.393 1.298 3.373.981.981 2.093 1.241 3.374 1.299C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.058 2.393-.318 3.374-1.299.98-.98 1.24-2.092 1.298-3.373.058-1.281.07-1.69.07-7.613 0-5.923-.012-6.332-.07-7.613-.058-1.281-.318-2.393-1.298-3.373-.981-.981-2.093-1.241-3.374-1.299C15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
                <span>lapinceinsta</span>
              </a>
              <a href="https://tiktok.com" className="social-link" target="_blank" rel="noopener noreferrer">
                {/* TikTok SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="TikTok">
                  <title>TikTok</title>
                  <path d="M12.75 2v12.019a2.25 2.25 0 1 1-2.25-2.25c.124 0 .246.012.366.03V8.97a6.75 6.75 0 1 0 6.75 6.75V8.25a4.5 4.5 0 0 0 3 0v3.75a7.5 7.5 0 0 1-7.5 7.5A7.5 7.5 0 0 1 4.5 12a7.5 7.5 0 0 1 7.5-7.5z" />
                </svg>
                <span>lapincetiktok</span>
              </a>
              <a href="https://youtube.com" className="social-link" target="_blank" rel="noopener noreferrer">
                {/* YouTube SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="YouTube">
                  <title>YouTube</title>
                  <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.24 3.5 12 3.5 12 3.5s-7.24 0-9.391.566A2.994 2.994 0 0 0 .502 6.186C0 8.338 0 12 0 12s0 3.662.502 5.814a2.994 2.994 0 0 0 2.107 2.12C4.76 20.5 12 20.5 12 20.5s7.24 0 9.391-.566a2.994 2.994 0 0 0 2.107-2.12C24 15.662 24 12 24 12s0-3.662-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>solutionslapince</span>
              </a>
            </div>
          </div>
        </div>
        </div>

        <Footer />
      </div>
      );
};

      export default Contact;
