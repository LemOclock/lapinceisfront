import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer/footer";
import "./Budget.scss";

const Budget = () => {
  const [budgets, setBudgets] = useState({
    NOURRITURE: { montant: 400, categorie: "Nourriture" },
    LOISIR: { montant: 200, categorie: "Voyage" },
    VACANCES: { montant: 1000, categorie: "Voyage" },
  });

  const [selectedBudget, setSelectedBudget] = useState("NOURRITURE");
  const [currentMonth, setCurrentMonth] = useState("JUIN 2025");
  const [showBudgets, setShowBudgets] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    categorie: "Choisir",
    montant: "",
  });

  const categories = ["Nourriture", "Voyage", "Voiture"];
  const months = [
    "JANVIER 2025",
    "FÉVRIER 2025",
    "MARS 2025",
    "AVRIL 2025",
    "MAI 2025",
    "JUIN 2025",
    "JUILLET 2025",
    "AOÛT 2025",
    "SEPTEMBRE 2025",
    "OCTOBRE 2025",
    "NOVEMBRE 2025",
    "DÉCEMBRE 2025",
  ];

  const transactions =
    {
      "JANVIER 2025": [
        { libelle: "Restaurant", price: 45, date: "15/01/2025", lieu: "LYON" },
      ],
      "FÉVRIER 2025": [
        { libelle: "Pizza", price: 15, date: "05/02/2025", lieu: "LILLE" },
      ],
      "MARS 2025": [
        {
          libelle: "Supermarché",
          price: 120,
          date: "08/03/2025",
          lieu: "PARIS",
        },
      ],
      "AVRIL 2025": [
        {
          libelle: "Restaurant",
          price: 65,
          date: "03/04/2025",
          lieu: "MARSEILLE",
        },
      ],
      "MAI 2025": [
        { libelle: "Marché", price: 35, date: "07/05/2025", lieu: "TOULOUSE" },
      ],
      "JUIN 2025": [
        { libelle: "Macdo", price: 25, date: "20/06/2025", lieu: "PARIS" },
        { libelle: "Courses", price: 85, date: "15/06/2025", lieu: "PARIS" },
      ],
      "JUILLET 2025": [
        {
          libelle: "Vacances resto",
          price: 95,
          date: "10/07/2025",
          lieu: "NICE",
        },
      ],
      "AOÛT 2025": [
        { libelle: "BBQ", price: 55, date: "05/08/2025", lieu: "MONTPELLIER" },
      ],
      "SEPTEMBRE 2025": [
        {
          libelle: "Rentrée courses",
          price: 85,
          date: "03/09/2025",
          lieu: "LYON",
        },
      ],
      "OCTOBRE 2025": [
        {
          libelle: "Automne resto",
          price: 68,
          date: "12/10/2025",
          lieu: "STRASBOURG",
        },
      ],
      "NOVEMBRE 2025": [
        {
          libelle: "Comfort food",
          price: 45,
          date: "08/11/2025",
          lieu: "DIJON",
        },
      ],
      "DÉCEMBRE 2025": [
        {
          libelle: "Repas Noël",
          price: 120,
          date: "24/12/2025",
          lieu: "PARIS",
        },
      ],
    }[currentMonth] || [];

  const budget = budgets[selectedBudget] || { montant: 0, categorie: "" };
  const spent = transactions.reduce((sum, t) => sum + t.price, 0);
  const progressPercent = Math.min((spent / budget.montant) * 100, 100);
  const progressColor =
    progressPercent >= 100
      ? "#C8321F"
      : progressPercent >= 75
        ? "#EAA93D"
        : "#28a745";

  const changeMonth = (dir) => {
    const idx = months.indexOf(currentMonth);
    const newIdx = idx + dir;
    if (newIdx >= 0 && newIdx < months.length) setCurrentMonth(months[newIdx]);
  };

  const updateForm = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const closeModal = () => {
    setShowModal(false);
    setShowCategories(false);
    setForm({ nom: "", categorie: "Choisir", montant: "" });
  };

  const createBudget = () => {
    if (!form.nom || form.categorie === "Choisir" || !form.montant) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const name = form.nom.toUpperCase();
    if (budgets[name]) {
      alert("Ce budget existe déjà !");
      return;
    }

    setBudgets((prev) => ({
      ...prev,
      [name]: { montant: +form.montant, categorie: form.categorie },
    }));
    setSelectedBudget(name);
    alert(`Budget "${form.nom}" créé !`);
    closeModal();
  };

  return (
    <div className="budget-page">
      <Navbar />
      <div className="budget-container">
        {/* Sélecteur budget */}
        <div className="budget-selector">
          <button
            className="budget-main-button"
            onClick={() => setShowBudgets(!showBudgets)}
          >
            {selectedBudget} ▼
          </button>
          {showBudgets && (
            <div className="budget-dropdown">
              {Object.entries(budgets).map(([name, data]) => (
                <button
                  key={name}
                  className={`budget-option ${name === selectedBudget ? "selected" : ""
                    }`}
                  onClick={() => {
                    setSelectedBudget(name);
                    setShowBudgets(false);
                  }}
                >
                  {name} <small>({data.categorie})</small>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation mois */}
        <div className="month-nav">
          <button onClick={() => changeMonth(-1)}>‹</button>
          <span>{currentMonth}</span>
          <button onClick={() => changeMonth(1)}>›</button>
        </div>

        {/* Info budget */}
        <div className="budget-info">
          <p>
            Budget {selectedBudget} ({budget.categorie}) : {budget.montant}€
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
          <span>{spent}€</span>
        </div>

        {/* Transactions */}
        <div className="transactions">
          <div className="table-header">
            <span>Libellé</span>
            <span>Date</span>
            <span>Lieu</span>
          </div>
          {transactions.map((t, i) => (
            <div key={i} className="table-row">
              <span>
                {t.libelle} {t.price}€
              </span>
              <span>{t.date}</span>
              <span>{t.lieu}</span>
            </div>
          ))}
          <button className="voir-plus">Voir plus</button>
        </div>

        <button className="create-budget" onClick={() => setShowModal(true)}>
          CRÉE UN BUDGET
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="modal-header">
              <h3>
                Création d'un budget
                <br />
                {currentMonth}
              </h3>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Nom du budget</label>
                <input
                  value={form.nom}
                  onChange={(e) => updateForm("nom", e.target.value)}
                  placeholder="Ex: Transport..."
                />
              </div>

              <div className="form-group">
                <label>Catégorie</label>
                <div className="category-selector">
                  <button
                    className="category-button"
                    onClick={() => setShowCategories(!showCategories)}
                  >
                    {form.categorie} ▼
                  </button>
                  {showCategories && (
                    <div className="category-dropdown">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            updateForm("categorie", cat);
                            setShowCategories(false);
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Montant maximum</label>
                <input
                  type="number"
                  value={form.montant}
                  onChange={(e) => updateForm("montant", e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <button className="modal-validate" onClick={createBudget}>
              Valider
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Budget;
