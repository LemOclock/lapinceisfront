import GlobalStyle from "../../global.scss";
import Style from "./navbar.scss";
import Menuburger from "../menuburger/menuburger";
import { useState, useEffect } from "react";
export default function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifie si un token est présent dans localStorage pour déterminer si l'utilisateur est connecté
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Si le token existe, isLoggedIn sera true
  }, []);
  return (
    <nav className="navbar">
      <div className="logonavbar">
        <img src="../../img/logo.png" alt="Logo" />
      </div>
      {!isLoggedIn && (
        <a href="/login">
          <button className="buttonbleu">
            Se connecter
          </button>
        </a>
      )}
      {isLoggedIn && <Menuburger />}
    </nav>
  );
}
