import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/footer";
import "./Budget.scss";
import {
  getUserBudgets,
  getOperations,
  searchOperations,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../../api/budgetApi";
import { findCompteId, getAllCategories } from "../../api/gestion";
import { useEffect } from "react";
import globalStyles from "../../global.scss";

const Budget = () => {
  // États
  const [budgets, setBudgets] = useState({});
  const [selectedBudget, setSelectedBudget] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [operations, setOperations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBudgets, setShowBudgets] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categoriesWithIds, setCategoriesWithIds] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    categorie: "Choisir",
    montant: "",
  });

  const [editForm, setEditForm] = useState({
    nom: "",
    categorie: "Choisir",
    montant: "",
  });

  // Générer nom du mois actuel
  const monthNames = [
    "JANVIER",
    "FÉVRIER",
    "MARS",
    "AVRIL",
    "MAI",
    "JUIN",
    "JUILLET",
    "AOÛT",
    "SEPTEMBRE",
    "OCTOBRE",
    "NOVEMBRE",
    "DÉCEMBRE",
  ];
  const currentMonth = `${
    monthNames[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  // Navigation mois
  const changeMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // API - Récupérer tous les budgets de l'utilisateur
  const fetchUserBudgets = async () => {
    try {
      const response = await getUserBudgets();
      const allBudgets = response.data.budgets || {};
      const budgetsWithNames = {};

      Object.values(allBudgets).forEach((budget) => {
        const shouldShow =
          budget.mois === currentDate.getMonth() + 1 &&
          budget.annee === currentDate.getFullYear();

        if (shouldShow) {
          budgetsWithNames[budget.nom] = budget;
        }
      });

      setBudgets(budgetsWithNames);

      const budgetNames = Object.keys(budgetsWithNames);
      if (budgetNames.length > 0 && !selectedBudget) {
        setSelectedBudget(budgetNames[0]);
      } else if (budgetNames.length === 0) {
        setSelectedBudget("");
      } else if (!budgetNames.includes(selectedBudget)) {
        setSelectedBudget(budgetNames[0]);
      }
    } catch (error) {
      console.error("Erreur récupération budgets:", error);
    }
  };

  const updateSelectedBudget = async () => {
    if (
      !editForm.nom ||
      editForm.categorie === "Choisir" ||
      !editForm.montant
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    let budgetData = null;

    try {
      const compteResponse = await findCompteId();
      const compteId = compteResponse.data.id;

      const selectedCategory = categoriesWithIds.find(
        (cat) => cat.nom_categorie === editForm.categorie
      );
      const categorieId = selectedCategory ? selectedCategory.id : null;

      const currentBudget = Object.values(budgets).find(
        (b) => b.nom === selectedBudget
      );
      const budgetId = currentBudget?.id;

      if (!budgetId) {
        alert("Erreur : Budget non trouvé");
        return;
      }

      budgetData = {
        nom_budget: editForm.nom,
        categorieId: categorieId,
        montant_limite: parseInt(editForm.montant),
        mois: currentDate.getMonth() + 1,
        annee: currentDate.getFullYear(),
        compteId: compteId,
        seuil_alerte: 80,
      };

      const response = await updateBudget(budgetId, budgetData);

      if (response.data.success) {
        fetchUserBudgets();
        setSelectedBudget(editForm.nom);
        alert(`Budget "${editForm.nom}" modifié avec succès`);
        closeEditModal();
      }
    } catch (error) {
      console.error("Erreur modification budget:", error);
      const errorMessage =
        error.response?.data?.errors?.budget ||
        error.response?.data?.message ||
        "Erreur lors de la modification du budget";
      alert(errorMessage);
    }
  };

  const deleteSelectedBudget = async () => {
    try {
      const currentBudget = Object.values(budgets).find(
        (b) => b.nom === selectedBudget
      );
      const budgetId = currentBudget?.id;

      if (!budgetId) {
        alert("Erreur : Budget non trouvé");
        return;
      }

      const response = await deleteBudget(budgetId);

      if (response.data.success) {
        alert(`Budget "${selectedBudget}" supprimé avec succès`);

        await fetchUserBudgets();

        const remainingBudgets = Object.keys(budgets).filter(
          (name) => name !== selectedBudget
        );
        if (remainingBudgets.length > 0) {
          setSelectedBudget(remainingBudgets[0]);
        } else {
          setSelectedBudget("");
        }

        closeDeleteModal();
      }
    } catch (error) {
      console.error("Erreur suppression budget:", error);
      const errorMessage =
        error.response?.data?.errors?.budget ||
        error.response?.data?.message ||
        "Erreur lors de la suppression du budget";
      alert(errorMessage);
    }
  };

  // API - Charger les catégories avec IDs
  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategoriesWithIds(response.data);
    } catch (error) {
      console.error("Erreur catégories:", error);
    }
  };

  // API - Récupérer opérations par budget et période
  const fetchOperations = async (filters = {}) => {
    setIsSearching(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const formattedMonth = `${year}-${String(month).padStart(2, "0")}`;

      const params = {
        month: formattedMonth,
        budget: selectedBudget,
        ...filters,
      };

      const response = await getOperations(params);
      setOperations(response.data.operations || []);
    } catch (error) {
      console.error("Erreur récupération opérations:", error);
      setOperations([]);
    }
    setIsSearching(false);
  };

  // API - Recherche globale
  const searchAllOperations = async () => {
    setIsSearching(true);
    try {
      const response = await searchOperations(searchQuery, selectedBudget);
      setOperations(response.data.operations || []);
    } catch (error) {
      console.error("Erreur recherche:", error);
      setOperations([]);
    }
    setIsSearching(false);
  };

  // Chargement initial des budgets et catégories
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserBudgets();
      loadCategories();
    }
  }, []);

  // Recharger budgets lors du changement de mois
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserBudgets();
    }
  }, [currentDate]);

  // Recherche en temps réel
  useEffect(() => {
    if (searchQuery && selectedBudget) {
      const timeout = setTimeout(searchAllOperations, 300);
      return () => clearTimeout(timeout);
    } else if (selectedBudget) {
      fetchOperations();
    }
  }, [searchQuery]);

  const budget = budgets[selectedBudget] || { montant: 0, categorie: "" };
  const spent = operations.reduce((sum, t) => sum + t.price, 0);
  const progressPercent = Math.min((spent / budget.montant) * 100, 100);
  const progressColor =
    progressPercent >= 100
      ? "#C8321F"
      : progressPercent >= 75
      ? "#EAA93D"
      : "#28a745";

  const updateForm = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateEditForm = (field, value) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  const closeModal = () => {
    setShowModal(false);
    setShowCategories(false);
    setForm({
      nom: "",
      categorie: "Choisir",
      montant: "",
    });
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setShowCategories(false);
    setEditForm({
      nom: "",
      categorie: "Choisir",
      montant: "",
    });
  };

  const openEditModal = () => {
    if (!selectedBudget) {
      alert("Veuillez sélectionner un budget à modifier");
      return;
    }

    const currentBudget = budgets[selectedBudget];
    setEditForm({
      nom: selectedBudget,
      categorie: currentBudget.categorie,
      montant: currentBudget.montant.toString(),
    });
    setShowEditModal(true);
  };

  const openDeleteModal = () => {
    if (!selectedBudget) {
      alert("Veuillez sélectionner un budget à supprimer");
      return;
    }
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const createNewBudget = async () => {
    if (!form.nom || form.categorie === "Choisir" || !form.montant) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    let budgetData = null;

    try {
      const compteResponse = await findCompteId();
      const compteId = compteResponse.data.id;

      const selectedCategory = categoriesWithIds.find(
        (cat) => cat.nom_categorie === form.categorie
      );
      const categorieId = selectedCategory ? selectedCategory.id : null;

      budgetData = {
        nom_budget: form.nom,
        categorieId: categorieId,
        montant_limite: parseInt(form.montant),
        mois: currentDate.getMonth() + 1,
        annee: currentDate.getFullYear(),
        compteId: compteId,
        seuil_alerte: 80,
      };

      const response = await createBudget(budgetData);

      if (response.data.success) {
        fetchUserBudgets();
        setSelectedBudget(response.data.budget.nom);
        alert(`Budget "${form.nom}" créé avec succès`);
        closeModal();
      }
    } catch (error) {
      console.error("Erreur création budget:", error);
      const errorMessage =
        error.response?.data?.errors?.budget ||
        error.response?.data?.message ||
        "Erreur lors de la création du budget";
      alert(errorMessage);
    }
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
            {selectedBudget || "Sélectionner un budget"} ▼
          </button>
          {showBudgets && (
            <div className="budget-dropdown">
              {Object.entries(budgets).map(([name, data]) => (
                <button
                  key={name}
                  className={`budget-option ${
                    name === selectedBudget ? "selected" : ""
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
        {selectedBudget && (
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
        )}

        {/* Opérations avec recherche */}
        <div className="transactions">
          <div className="search-header">
            <div className="search-container">
              <span
                className="search-icon"
                onClick={() => setShowSearchModal(true)}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Rechercher opérations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {isSearching && <span className="loading">⏳</span>}
            </div>
          </div>

          <div className="table-header">
            <span>Libellé</span>
            <span>Date</span>
            <span>Lieu</span>
          </div>
          {operations.map((t, i) => (
            <div key={i} className="table-row">
              <span>
                {t.libelle} {t.price}€
              </span>
              <span>{t.date}</span>
              <span>{t.lieu}</span>
            </div>
          ))}
          <button
            className="voir-plus"
            onClick={() => setShowSearchModal(true)}
          >
            Voir plus
          </button>
        </div>

        <button className="create-budget" onClick={() => setShowModal(true)}>
          CRÉER UN BUDGET
        </button>

        <button
          className="create-budget"
          onClick={openEditModal}
          disabled={!selectedBudget}
          style={{
            marginTop: "10px",
            opacity: selectedBudget ? 1 : 0.5,
            cursor: selectedBudget ? "pointer" : "not-allowed",
          }}
        >
          MODIFIER LE BUDGET
        </button>

        <button
          className="create-budget"
          onClick={openDeleteModal}
          disabled={!selectedBudget}
          style={{
            marginTop: "10px",
            backgroundColor: selectedBudget ? "#E74C3C" : "#ccc",
            cursor: selectedBudget ? "pointer" : "not-allowed",
          }}
        >
          SUPPRIMER
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
                  placeholder="Ex: Pass Navigo, TGV..."
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
                      {categoriesWithIds.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            updateForm("categorie", cat.nom_categorie);
                            setShowCategories(false);
                          }}
                        >
                          {cat.nom_categorie}
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

            <button className="modal-validate" onClick={createNewBudget}>
              Valider
            </button>
          </div>
        </div>
      )}

      {/* Modal Modification */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeEditModal}>
              ×
            </button>

            <div className="modal-header">
              <h3>
                Modification du budget
                <br />
                {selectedBudget}
              </h3>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Nom du budget</label>
                <input
                  value={editForm.nom}
                  onChange={(e) => updateEditForm("nom", e.target.value)}
                  placeholder="Ex: Pass Navigo, TGV..."
                />
              </div>

              <div className="form-group">
                <label>Catégorie</label>
                <div className="category-selector">
                  <button
                    className="category-button"
                    onClick={() => setShowCategories(!showCategories)}
                  >
                    {editForm.categorie} ▼
                  </button>
                  {showCategories && (
                    <div className="category-dropdown">
                      {categoriesWithIds.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            updateEditForm("categorie", cat.nom_categorie);
                            setShowCategories(false);
                          }}
                        >
                          {cat.nom_categorie}
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
                  value={editForm.montant}
                  onChange={(e) => updateEditForm("montant", e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <button className="modal-validate" onClick={updateSelectedBudget}>
              Modifier
            </button>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDeleteModal}>
              ×
            </button>

            <div className="modal-header">
              <h3>Supprimer le budget</h3>
            </div>

            <div className="modal-form">
              <p style={{ textAlign: "center", marginBottom: "20px" }}>
                Supprimer définitivement "{selectedBudget}" ?
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={closeDeleteModal}
                  className="modal-validate"
                  style={{ backgroundColor: "#95A5A6" }}
                >
                  Annuler
                </button>
                <button
                  onClick={deleteSelectedBudget}
                  className="modal-validate"
                  style={{ backgroundColor: "#E74C3C" }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal recherche avancée */}
      {showSearchModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="modal-content search-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowSearchModal(false)}
            >
              ×
            </button>

            <div className="modal-header">
              <h3>Recherche avancée</h3>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Rechercher dans toutes les opérations</label>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom, montant, lieu..."
                />
              </div>

              <div className="form-group">
                <label>Filtrer par catégorie</label>
                <select
                  onChange={(e) =>
                    fetchOperations({ category: e.target.value })
                  }
                >
                  <option value="">Toutes catégories</option>
                  {categoriesWithIds.map((cat) => (
                    <option key={cat.id} value={cat.nom_categorie}>
                      {cat.nom_categorie}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBudget && (
                <div className="budget-comparison">
                  <h4>Comparaison budget</h4>
                  <p>
                    Budget {selectedBudget}: {budget.montant}€
                  </p>
                  <p>Dépensé: {spent}€</p>
                  <p
                    className={
                      spent > budget.montant ? "over-budget" : "under-budget"
                    }
                  >
                    {spent > budget.montant
                      ? "Dépassement"
                      : "Dans les limites"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Budget;
