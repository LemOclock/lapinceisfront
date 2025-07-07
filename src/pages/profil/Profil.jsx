import React, { useState } from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import "./Profil.scss";

const Profil = ({ isLoggedIn = true }) => {
  const [notifications, setNotifications] = useState({
    sms: false,
    email: true,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const userInfo = [
    { label: "Nom Prénom :", value: "La Pince" },
    { label: "Email :", value: "lapince@email.fr" },
    { label: "Date de création :", value: "26/12/2025" },
    { label: "Numéro de téléphone :", value: "0620202020" },
  ];

  const toggleNotification = (type) =>
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    setShowDeleteConfirmModal(true);
  };

  const handleFinalDelete = () => {
    alert("Compte définitivement supprimé !");
    setShowDeleteConfirmModal(false);
    setDeleteConfirmText("");
  };

  const handlePasswordSubmit = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    alert("Mot de passe changé !");
    setShowPasswordModal(false);
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const updatePassword = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="profil-page">
      {isLoggedIn ? (
        <Navbar />
      ) : (
        <button className="buttonbleu">Se connecter</button>
      )}

      <div className="profil-container">
        <div className="profile-photo">
          <div className="photo-placeholder"></div>
          <button className="edit-photo">✏️</button>
        </div>

        <div className="profile-info">
          <h2>
            Profil <span className="edit-icon">✏️</span>
          </h2>
          {userInfo.map((info, index) => (
            <div key={index} className="info-row">
              <span>{info.label}</span>
              <span>{info.value}</span>
            </div>
          ))}
          <button
            className="change-password"
            onClick={() => setShowPasswordModal(true)}
          >
            Changer votre mot de passe
          </button>
        </div>

        <div className="settings-section">
          <h2>Paramètres</h2>
          <h3>Centre de notification</h3>
          {Object.entries(notifications).map(([type, active]) => (
            <div key={type} className="toggle-row">
              <span>{type.toUpperCase()}</span>
              <button
                className={`toggle ${active ? "active" : ""}`}
                onClick={() => toggleNotification(type)}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>
          ))}
          <button
            className="delete-account"
            onClick={() => setShowDeleteModal(true)}
          >
            Supprimer son compte
          </button>
        </div>
      </div>

      {/* Première modale de suppression */}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowDeleteModal(false)}
            >
              ×
            </button>
            <div className="modal-body">
              <p>Êtes vous sûres de vouloir supprimer votre compte ?</p>
              <button className="confirm-delete" onClick={handleDeleteAccount}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deuxième modale de confirmation finale */}
      {showDeleteConfirmModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirmModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowDeleteConfirmModal(false)}
            >
              ×
            </button>
            <div className="delete-confirm-modal">
              <p>
                Pour confirmer la suppression, tapez "Supprimer mon compte" :
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Supprimer mon compte"
              />
              <button
                className="final-delete"
                onClick={handleFinalDelete}
                disabled={deleteConfirmText !== "Supprimer mon compte"}
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale changement mot de passe */}
      {showPasswordModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowPasswordModal(false)}
            >
              ×
            </button>

            <div className="password-modal">
              <h3>Confirmation du changement du mot de passe</h3>

              <div className="password-form">
                <label>Mot de passe actuel :</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => updatePassword("current", e.target.value)}
                />

                <label>Nouveau mot de passe :</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => updatePassword("new", e.target.value)}
                />

                <label>Confirmation du mot de passe :</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => updatePassword("confirm", e.target.value)}
                />
              </div>

              <button
                className="submit-password"
                onClick={handlePasswordSubmit}
              >
                Changer votre mot de passe
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profil;
