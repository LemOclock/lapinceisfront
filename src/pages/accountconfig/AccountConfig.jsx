import React, { useState } from "react";
import Footer from "../../components/Footer/footer";
import "./AccountConfig.scss";
import { accountConfig } from "../../api/accountConfig";
import { useNavigate } from "react-router-dom";
import "../../global.scss"; 




const AccountConfig = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState({
    nom_compte: "",
    banque: "",
    solde_initial: "0",
    devise: "EUR",
  });

  const handleChange = (e) =>
    setAllData({ ...allData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🚀 Données envoyées:', allData);

    try {
      const response = await accountConfig(allData);
      console.log('Register successful:', response.data);
      navigate('/dashboard'); // Redirige vers la page de tableau de bord ou une autre page spécifiée
    } catch (error) {
      console.error('Register error:', error);
    }
  };



  return (
    <div className="account-config-page">
      <div className="account-config-container">
        <div className="account-config-card">
          <div className="logo">
            <img src="../../img/logo.png" alt="La Pince" />
          </div>

          <div className="page-title">
            <h2>INFORMATIONS DU COMPTE</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom</label>
              <input
                name="nom_compte"
                onChange={handleChange}
                placeholder="Nom du compte"
                value={allData.nom_compte}
                required
              />
            </div>

            <div className="form-group">
              <label>Banque</label>
              <input
                name="banque"
                onChange={handleChange}
                placeholder="Nom de votre banque"
                value={allData.banque}
              />
            </div>

            <div className="form-group">
              <label>Solde initial</label>
              <input
                type="number"
                name="solde_initial"
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                value={allData.solde_initial}
              />
            </div>

            <div className="form-group">
              <label>Devise</label>
              <div className="currency-selector">
                <select name="devise" className="currency-button" onChange={handleChange} value={allData.devise}>
                  <option value="EUR">EUR €</option>
                  <option value="USD">USD $</option>
                  <option value="GBP">GBP £</option>
                </select>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Créer le compte
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountConfig;
