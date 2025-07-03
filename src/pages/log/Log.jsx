import React from "react";
import "./Log.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/footer";

import { login, register } from "../../api/auth";

const Log = () => {
  const Navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    mot_de_passe: "",
  });

  const [registerData, setRegisterData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    telephone: "",
  });

  const handleChangeLogin = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleChangeRegister = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(loginData.email, loginData.mot_de_passe);
      console.log("Login successful:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Token stocké:", response.data.token);
        console.log(
          "Token depuis localStorage:",
          localStorage.getItem("token")
        );
      } else {
        console.log("Aucun token reçu du serveur");
      }

      Navigate(response.data.redirectUrl);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(registerData);
      console.log("Register successful:", response.data);
      // Redirection ou gestion du succès
      Navigate(response.data.redirectUrl); // Redirige vers la page de connexion après l'inscription réussie
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <>
      <div className="log-container">
        <div className="logo_container">
          <img
            src="https://i.imgur.com/HrPQbHZ.png"
            alt="Logo La Pince"
            className="logo"
          />
        </div>
        <div className="toggle-buttons">
          <button
            id="login"
            className={showLogin ? "active" : ""}
            onClick={() => setShowLogin(true)}
          >
            Se connecter
          </button>
          <button
            id="register"
            className={!showLogin ? "active" : ""}
            onClick={() => setShowLogin(false)}
          >
            S'inscrire
          </button>
        </div>

        {/* Formulaire Login */}
        {showLogin && (
          <form onSubmit={handleLoginSubmit} action="POST" id="login">
            <label> Email </label>
            <input
              type="text"
              name="email"
              id="email_login"
              placeholder="Email"
              onChange={handleChangeLogin}
              value={loginData.email}
            />
            <label> Mot de passe </label>
            <input
              type="password"
              name="mot_de_passe"
              id="mot_de_passe_login"
              placeholder="Mot de passe"
              onChange={handleChangeLogin}
              value={loginData.mot_de_passe}
            />
            <button type="submit">Se connecter</button>
          </form>
        )}

        {/* Formulaire Register */}
        {!showLogin && (
          <form onSubmit={handleRegisterSubmit} action="POST" id="register">
            <label> Nom </label>
            <input
              type="text"
              name="nom"
              id="nom"
              placeholder="Nom"
              onChange={handleChangeRegister}
              value={registerData.nom}
              required
            />
            <label> Prénom </label>
            <input
              type="text"
              name="prenom"
              id="prenom"
              placeholder="Prénom"
              onChange={handleChangeRegister}
              value={registerData.prenom}
              required
            />
            <label> Email </label>
            <input
              type="email"
              name="email"
              id="email_register"
              placeholder="Email"
              value={registerData.email}
              onChange={handleChangeRegister}
              required
            />
            <label> Mot de passe </label>
            <input
              type="password"
              name="mot_de_passe"
              id="mot_de_passe"
              placeholder="Mot de passe"
              value={registerData.mot_de_passe}
              onChange={handleChangeRegister}
              required
            />
            <label> Numéro de téléphone</label>
            <input
              type="text"
              name="telephone"
              id="telephone"
              placeholder="Numéro de téléphone"
              value={registerData.telephone}
              onChange={handleChangeRegister}
            />
            <button type="submit">S'inscrire</button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Log;
