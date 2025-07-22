import React, { use } from "react";
import "./Log.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/footer";
import { login, register } from "../../api/auth";
import "../../global.scss";



const Log = () => {
  const Navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);

  const [registerError, setRegisterError] = useState("");

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

  const [showAlert, setShowAlert] = useState(false);


  // -----------------------------------------------

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    minUppercase: false,
    minLowercase: false,
    minNumber: false,
    minSymbol: false,
  });

  const checkPasswordCriteria = (password) => {
    return {
      minLength: password.length >= 12,
      minUppercase: /[A-Z]/.test(password),
      minLowercase: /[a-z]/.test(password),
      minNumber: /[0-9]/.test(password),
      minSymbol: /[^A-Za-z0-9]/.test(password),
    };
  };
  // -----------------------------------------------
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    const passwordInput = document.getElementById("mot_de_passe");

  };

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
    const criteria = checkPasswordCriteria(registerData.mot_de_passe);
    const allValid = Object.values(criteria).every(Boolean);

    if (!allValid) {
      setRegisterError("Le mot de passe ne respecte pas tous les critères.");
      return;
    } else {
      setRegisterError("");
    }

    try {
      const response = await register(registerData);
      console.log("Register successful:", response.data);

      setShowAlert(true);

      // Masquer l'alerte après 3 secondes
      setTimeout(() => {
        setShowAlert(false);
        setShowLogin(true); // Retourner au login
      }, 5000);

    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <>
      <div className="log-container">

        {showAlert && (
          <div className="alertregister">
            <p>Inscription réussie ! 🎉</p>
            <p>Vous allez être redirigé.</p>
          </div>
        )}
        <div className="logo_container">
          <img
            src="https://i.imgur.com/HrPQbHZ.png"
            alt="Logo La Pince"
            className="logo"
          />
        </div>
        <div className="toggle-buttons">
          <button
            id="loginbutton"
            className={showLogin ? "active" : ""}
            onClick={() => setShowLogin(true)}
          >
            Se connecter
          </button>
          <button
            id="registerbutton"
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
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="mot_de_passe"
                id="mot_de_passe_login"
                placeholder="Mot de passe"
                onChange={handleChangeLogin}
                value={loginData.mot_de_passe}
              />
              <img
                className='logopass'
                src={showPassword ? "/img/hidden.png" : "/img/eye.png"}
                alt={showPassword ? "Cacher" : "Afficher"}
                onClick={togglePasswordVisibility}
              />
            </div>
            <button type="submit">Se connecter</button>
          </form>
        )}

        {/* Formulaire Register */}
        {!showLogin && (
          <form onSubmit={handleRegisterSubmit} action="POST" id="register">
            {registerError &&
              (
                <div className="alertregister">
                  <p>{registerError}</p>
                </div>
              )
            }
            <label> Nom * </label>
            <input
              type="text"
              name="nom"
              id="nom"
              placeholder="Nom"
              onChange={handleChangeRegister}
              value={registerData.nom}
              required
            />
            <label> Prénom * </label>
            <input
              type="text"
              name="prenom"
              id="prenom"
              placeholder="Prénom"
              onChange={handleChangeRegister}
              value={registerData.prenom}
              required
            />
            <label> Email * </label>
            <input
              type="email"
              name="email"
              id="email_register"
              placeholder="Email"
              value={registerData.email}
              onChange={handleChangeRegister}
              required
            />

            <label> Mot de passe *</label>
            <div>
              <div className="password-input-container">
                <input className="password-input"
                  type={showPassword ? "text" : "password"}
                  name="mot_de_passe"
                  id="mot_de_passe"
                  placeholder="Mot de passe"
                  value={registerData.mot_de_passe}
                  onChange={e => {
                    handleChangeRegister(e);
                    setPasswordCriteria(checkPasswordCriteria(e.target.value));
                  }}
                  required
                />
                <img
                  className='logopass'
                  src={showPassword ? "/img/hidden.png" : "/img/eye.png"}
                  alt={showPassword ? "Cacher" : "Afficher"}
                  onClick={togglePasswordVisibility}
                />
              </div>
              <ul className="password-criteria">
                <li className={passwordCriteria.minLength ? "valid" : "invalid"}>12 caractères</li>
                <li className={passwordCriteria.minUppercase ? "valid" : "invalid"}>1 majuscule</li>
                <li className={passwordCriteria.minLowercase ? "valid" : "invalid"}>1 minuscule</li>
                <li className={passwordCriteria.minNumber ? "valid" : "invalid"}>1 chiffre</li>
                <li className={passwordCriteria.minSymbol ? "valid" : "invalid"}>1 caractère spécial</li>
              </ul>

            </div>


            <label> Numéro de téléphone </label>
            <input
              type="text"
              name="telephone"
              id="telephone"
              placeholder="Numéro de téléphone"
              value={registerData.telephone}
              onChange={handleChangeRegister}
            />
            <button type="submit">S'inscrire</button>
            <p className="champs-obligatoires"> * Champs obligatoires</p>
          </form>

        )}
      </div>
      <Footer />
    </>
  );
};

export default Log;
