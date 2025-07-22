import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import "./404.scss";
import "../../global.scss";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="NotFound-page">
        <h1>404</h1>
        <p>Cette page existe pas encore mais on y travail..</p>

        <img
          src="https://media.giphy.com/media/6Ea305BHewPmmk9Ehm/giphy.gif"
          alt="Perfect loop orbo"
          style={{
            width: "600px",
            maxWidth: "100%",
            margin: "2rem auto",
            display: "block",
          }}
        />
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
