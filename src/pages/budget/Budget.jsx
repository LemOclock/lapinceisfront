import React, { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
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

const Budget = () => {
  const [budgets, setBudgets] = useState({});
  const [selectedBudget, setSelectedBudget] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allOperations, setAllOperations] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBudgets, setShowBudgets] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categoriesWithIds, setCategoriesWithIds] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEditFormValid, setIsEditFormValid] = useState(false);
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
  const [localSearches, setLocalSearches] = useState({});

  // Cache pour éviter appels API dupliqués
  const [percentageUpdates, setPercentageUpdates] = useState({});

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
  const budgetEntries = Object.entries(budgets);
  const maxSlides = Math.max(0, budgetEntries.length - 3);

  const validateBudgetForm = useCallback(
    (formData, isEdit = false) => {
      const errors = {};

      if (!formData.nom?.trim()) {
        errors.nom = "Le nom du budget est obligatoire";
      } else if (formData.nom.trim().length < 2) {
        errors.nom = "Le nom doit contenir au moins 2 caractères";
      } else if (formData.nom.trim().length > 50) {
        errors.nom = "Le nom ne peut pas dépasser 50 caractères";
      } else if (!/^[a-zA-ZÀ-ÿ0-9\s\-_]+$/.test(formData.nom.trim())) {
        errors.nom =
          "Le nom ne peut contenir que des lettres, chiffres, espaces, tirets et underscores";
      } else {
        const existingNames = Object.keys(budgets);
        const currentName = isEdit ? selectedBudget : null;
        if (
          existingNames.includes(formData.nom.trim()) &&
          formData.nom.trim() !== currentName
        ) {
          errors.nom = "Un budget avec ce nom existe déjà pour cette période";
        }
      }

      if (!formData.categorie || formData.categorie === "Choisir") {
        errors.categorie = "Veuillez sélectionner une catégorie";
      } else if (
        !categoriesWithIds
          .map((cat) => cat.nom_categorie)
          .includes(formData.categorie)
      ) {
        errors.categorie = "Catégorie non valide";
      }

      if (!formData.montant?.toString().trim()) {
        errors.montant = "Le montant est obligatoire";
      } else {
        const amount = parseFloat(formData.montant);
        if (isNaN(amount)) {
          errors.montant = "Le montant doit être un nombre valide";
        } else if (amount <= 0) {
          errors.montant = "Le montant doit être supérieur à 0";
        } else if (amount < 1) {
          errors.montant = "Le montant minimum est de 1€";
        } else if (amount > 100000000) {
          errors.montant = "Le montant ne peut pas dépasser 100 000 000€";
        } else {
          const montantStr = formData.montant.toString();
          if (!/^\d+(\.\d{1,2})?$/.test(montantStr)) {
            errors.montant = "Le montant ne peut avoir que 2 décimales maximum";
          }
        }
      }

      return { isValid: Object.keys(errors).length === 0, errors };
    },
    [budgets, categoriesWithIds, selectedBudget]
  );

  useEffect(() => {
    const validation = validateBudgetForm(form);
    setFormErrors(validation.errors);
    setIsFormValid(validation.isValid);
  }, [form, validateBudgetForm]);

  useEffect(() => {
    const validation = validateBudgetForm(editForm, true);
    setEditFormErrors(validation.errors);
    setIsEditFormValid(validation.isValid);
  }, [editForm, validateBudgetForm]);

  const renderFieldError = (fieldName, errors) =>
    errors[fieldName] ? (
      <span className="field-error">{errors[fieldName]}</span>
    ) : null;

  const validateSearchQuery = (query) => {
    if (query.length > 100)
      return "La recherche ne peut pas dépasser 100 caractères";
    if (query.includes("<") || query.includes(">"))
      return "Caractères non autorisés dans la recherche";
    return null;
  };

  const changeMonth = useCallback((direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);

  const fetchUserBudgets = async () => {
    try {
      const response = await getUserBudgets();
      const allBudgets = response.data.budgets || {};
      const budgetsWithNames = {};

      Object.values(allBudgets).forEach((budget) => {
        if (
          budget.mois === currentDate.getMonth() + 1 &&
          budget.annee === currentDate.getFullYear()
        ) {
          budgetsWithNames[budget.nom] = budget;
        }
      });

      setBudgets(budgetsWithNames);
      const budgetNames = Object.keys(budgetsWithNames);
      if (budgetNames.length > 0 && !selectedBudget)
        setSelectedBudget(budgetNames[0]);
      else if (budgetNames.length === 0) setSelectedBudget("");
      else if (!budgetNames.includes(selectedBudget))
        setSelectedBudget(budgetNames[0]);
    } catch (error) {
      console.error("Erreur récupération budgets:", error);
    }
  };

  const updateSelectedBudget = async () => {
    const validation = validateBudgetForm(editForm, true);
    if (!validation.isValid) {
      setEditFormErrors(validation.errors);
      return;
    }

    try {
      const compteResponse = await findCompteId();
      const selectedCategory = categoriesWithIds.find(
        (cat) => cat.nom_categorie === editForm.categorie
      );
      const currentBudget = Object.values(budgets).find(
        (b) => b.nom === selectedBudget
      );

      if (!currentBudget?.id) {
        alert("Erreur : Budget non trouvé");
        return;
      }

      const budgetData = {
        nom_budget: editForm.nom.trim(),
        categorieId: selectedCategory?.id,
        montant_limite: Math.round(parseFloat(editForm.montant) * 100) / 100,
        mois: currentDate.getMonth() + 1,
        annee: currentDate.getFullYear(),
        compteId: compteResponse.data.id,
        seuil_alerte: 80,
      };

      const response = await updateBudget(currentBudget.id, budgetData);
      if (response.data.success) {
        fetchUserBudgets();
        setSelectedBudget(editForm.nom.trim());
        alert(`Budget "${editForm.nom.trim()}" modifié avec succès`);
        closeEditModal();
      }
    } catch (error) {
      console.error("Erreur modification budget:", error);
      alert(
        error.response?.data?.errors?.budget ||
          error.response?.data?.message ||
          "Erreur lors de la modification du budget"
      );
    }
  };

  const deleteSelectedBudget = async () => {
    try {
      const currentBudget = Object.values(budgets).find(
        (b) => b.nom === selectedBudget
      );
      if (!currentBudget?.id) {
        alert("Erreur : Budget non trouvé");
        return;
      }

      const response = await deleteBudget(currentBudget.id);
      if (response.data.success) {
        alert(`Budget "${selectedBudget}" supprimé avec succès`);
        await fetchUserBudgets();
        const remainingBudgets = Object.keys(budgets).filter(
          (name) => name !== selectedBudget
        );
        setSelectedBudget(
          remainingBudgets.length > 0 ? remainingBudgets[0] : ""
        );
        closeDeleteModal();
      }
    } catch (error) {
      console.error("Erreur suppression budget:", error);
      alert(
        error.response?.data?.errors?.budget ||
          error.response?.data?.message ||
          "Erreur lors de la suppression du budget"
      );
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategoriesWithIds(response.data);
    } catch (error) {
      console.error("Erreur catégories:", error);
    }
  };

  const fetchAllOperations = useCallback(async () => {
    setIsSearching(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const formattedMonth = `${year}-${String(month).padStart(2, "0")}`;
      const operationsByBudget = {};

      for (const [budgetName, budgetData] of Object.entries(budgets)) {
        try {
          const response = await getOperations({
            month: formattedMonth,
            budget: budgetData.id,
          });
          operationsByBudget[budgetName] = response.data.operations || [];
        } catch (error) {
          console.error(`Erreur opérations pour ${budgetName}:`, error);
          operationsByBudget[budgetName] = [];
        }
      }
      setAllOperations(operationsByBudget);
    } catch (error) {
      console.error("Erreur récupération opérations:", error);
      setAllOperations({});
    }
    setIsSearching(false);
  }, [currentDate, budgets]);

  const searchAllOperations = useCallback(async () => {
    setIsSearching(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const response = await searchOperations(month, year);

      const allOperations = response.data.operations || [];
      const operationsByBudget = {};

      for (const [budgetName] of Object.entries(budgets)) {
        const filteredOps = allOperations.filter((op) => {
          const matchesBudget =
            op.budget_name === budgetName || op.nom_budget === budgetName;
          const matchesQuery =
            searchQuery === "" ||
            op.libelle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            op.lieu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            op.price?.toString().includes(searchQuery);

          return matchesBudget && matchesQuery;
        });
        operationsByBudget[budgetName] = filteredOps;
      }

      setAllOperations(operationsByBudget);
    } catch (error) {
      console.error("Erreur recherche:", error);
      fetchAllOperations();
    }
    setIsSearching(false);
  }, [budgets, searchQuery, currentDate, fetchAllOperations]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserBudgets();
      loadCategories();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUserBudgets();
  }, [currentDate]);

  useEffect(() => {
    if (Object.keys(budgets).length > 0) {
      fetchAllOperations();
    }
  }, [fetchAllOperations]);

  useEffect(() => {
    if (searchQuery && Object.keys(budgets).length > 0) {
      const timeout = setTimeout(searchAllOperations, 300);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, searchAllOperations]);

  const updateForm = useCallback((field, value) => {
    let sanitizedValue = value;
    if (field === "nom")
      sanitizedValue = value.slice(0, 50).replace(/[<>]/g, "");
    else if (field === "montant") {
      sanitizedValue = value.replace(/[^0-9.]/g, "");
      const parts = sanitizedValue.split(".");
      if (parts.length > 2)
        sanitizedValue = parts[0] + "." + parts.slice(1).join("");
    }
    setForm((prev) => ({ ...prev, [field]: sanitizedValue }));
  }, []);

  const updateEditForm = useCallback((field, value) => {
    let sanitizedValue = value;
    if (field === "nom")
      sanitizedValue = value.slice(0, 50).replace(/[<>]/g, "");
    else if (field === "montant") {
      sanitizedValue = value.replace(/[^0-9.]/g, "");
      const parts = sanitizedValue.split(".");
      if (parts.length > 2)
        sanitizedValue = parts[0] + "." + parts.slice(1).join("");
    }
    setEditForm((prev) => ({ ...prev, [field]: sanitizedValue }));
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setShowCategories(false);
    setForm({ nom: "", categorie: "Choisir", montant: "" });
    setFormErrors({});
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setShowCategories(false);
    setEditForm({ nom: "", categorie: "Choisir", montant: "" });
    setEditFormErrors({});
  };

  const openEditModal = (budgetName) => {
    if (!budgetName) {
      alert("Erreur : Budget non trouvé");
      return;
    }

    const currentBudget = budgets[budgetName];
    setEditForm({
      nom: budgetName,
      categorie: currentBudget.categorie,
      montant: currentBudget.montant.toString(),
    });
    setSelectedBudget(budgetName);
    setShowEditModal(true);
  };

  const openDeleteModal = (budgetName) => {
    if (!budgetName) {
      alert("Erreur : Budget non trouvé");
      return;
    }
    setSelectedBudget(budgetName);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => setShowDeleteModal(false);

  const createNewBudget = async () => {
    const validation = validateBudgetForm(form);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      const compteResponse = await findCompteId();
      const selectedCategory = categoriesWithIds.find(
        (cat) => cat.nom_categorie === form.categorie
      );

      const budgetData = {
        nom_budget: form.nom.trim(),
        categorieId: selectedCategory?.id,
        montant_limite: Math.round(parseFloat(form.montant) * 100) / 100,
        mois: currentDate.getMonth() + 1,
        annee: currentDate.getFullYear(),
        compteId: compteResponse.data.id,
        seuil_alerte: 80,
      };

      const response = await createBudget(budgetData);
      if (response.data.success) {
        fetchUserBudgets();
        setSelectedBudget(response.data.budget.nom);
        alert(`Budget "${form.nom.trim()}" créé avec succès`);
        closeModal();
      }
    } catch (error) {
      console.error("Erreur création budget:", error);
      alert(
        error.response?.data?.errors?.budget ||
          error.response?.data?.message ||
          "Erreur lors de la création du budget"
      );
    }
  };

  const handleSearchChange = (value) => {
    const error = validateSearchQuery(value);
    if (error) {
      console.warn("Erreur de recherche:", error);
      return;
    }
    setSearchQuery(value);
  };

  // Évite les appels API en boucle
  const updatePercentage = useCallback(
    async (budgetName, progressPercent) => {
      if (percentageUpdates[budgetName] === progressPercent) return;

      try {
        const currentBudget = budgets[budgetName];
        if (currentBudget?.id) {
          await updateBudget(currentBudget.id, {
            seuil_pourcentage: progressPercent,
          });
          setPercentageUpdates((prev) => ({
            ...prev,
            [budgetName]: progressPercent,
          }));
        }
      } catch (error) {
        console.error("Erreur mise à jour pourcentage:", error);
      }
    },
    [budgets, percentageUpdates]
  );

  // Calculs des stats
  const getBudgetStats = useMemo(() => {
    const cache = {};
    return (budgetName) => {
      const cacheKey = `${budgetName}-${JSON.stringify(budgets[budgetName])}-${
        (allOperations[budgetName] || []).length
      }`;

      if (cache[cacheKey]) return cache[cacheKey];

      const budget = budgets[budgetName] || { montant: 0 };
      const operations = allOperations[budgetName] || [];
      const spent = Math.abs(operations.reduce((sum, t) => sum + t.price, 0));
      const progressPercent = Math.min((spent / budget.montant) * 100, 100);
      const progressColor =
        progressPercent >= 100
          ? "#C8321F"
          : progressPercent >= 75
          ? "#EAA93D"
          : "#28a745";

      const result = { budget, spent, progressPercent, progressColor };
      cache[cacheKey] = result;
      return result;
    };
  }, [budgets, allOperations]);

  // Appels API centralisés dans useEffect dédié
  useEffect(() => {
    Object.keys(budgets).forEach((budgetName) => {
      const { progressPercent } = getBudgetStats(budgetName);
      updatePercentage(budgetName, progressPercent);
    });
  }, [budgets, allOperations, getBudgetStats, updatePercentage]);

  const nextSlide = () =>
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlides));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
  const getVisibleBudgets = () =>
    budgetEntries.slice(currentSlide, currentSlide + 3);

  useEffect(() => {
    if (currentSlide > maxSlides) setCurrentSlide(Math.max(0, maxSlides));
  }, [budgets, maxSlides]);

  const renderDesktopCard = (budgetName, budgetData) => {
    const { budget, spent, progressPercent, progressColor } =
      getBudgetStats(budgetName);
    const operations = allOperations[budgetName] || [];
    const localSearch = localSearches[budgetName] || "";

    const filteredOperations = operations.filter((operation) => {
      if (!localSearch) return true;
      const searchTerm = localSearch.toLowerCase();
      return (
        operation.libelle?.toLowerCase().includes(searchTerm) ||
        operation.lieu?.toLowerCase().includes(searchTerm) ||
        operation.price?.toString().includes(searchTerm)
      );
    });

    const updateLocalSearch = (value) => {
      setLocalSearches((prev) => ({
        ...prev,
        [budgetName]: value,
      }));
    };

    return (
      <div
        key={budgetName}
        className={`budget-card ${
          budgetName === selectedBudget ? "active" : ""
        }`}
        onClick={() => setSelectedBudget(budgetName)}
      >
        <div className="budget-card-selector">
          <button className="budget-card-button">{budgetName}</button>
        </div>

        <div className="budget-card-info">
          <p>
            Budget {budgetName} ({budgetData.categorie}) : {budget.montant}€
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

        <div className="budget-card-operations">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher opérations..."
              className="search-input"
              value={localSearch}
              onChange={(e) => updateLocalSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              maxLength="100"
            />
          </div>

          <div className="operations-table">
            <div className="table-header">
              <span>Libellé</span>
              <span>Montant</span>
              <span>Date</span>
              <span>Lieu</span>
            </div>
            {filteredOperations.slice(0, 3).map((operation, i) => (
              <div key={i} className="table-row">
                <span className="table-libelle">{operation.libelle}</span>
                <span className="table-montant">{operation.price}€</span>
                <span className="table-date">{operation.date}</span>
                <span className="table-lieu">{operation.lieu}</span>
              </div>
            ))}
            {filteredOperations.length === 0 && localSearch && (
              <div className="table-row no-operations">
                <span>Aucun résultat pour "{localSearch}"</span>
              </div>
            )}
            {filteredOperations.length === 0 && !localSearch && (
              <div className="table-row no-operations">
                <span>Aucune opération</span>
              </div>
            )}
            {filteredOperations.length > 3 && (
              <div className="table-row more-results">
                <span>+{filteredOperations.length - 3} résultats</span>
              </div>
            )}
          </div>
        </div>

        <div className="budget-card-actions">
          <button
            className="card-action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(budgetName);
            }}
          >
            Modifier le budget
          </button>
          <button
            className="card-action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(budgetName);
            }}
          >
            Supprimer
          </button>
        </div>
      </div>
    );
  };

  const renderEmptyCard = () => (
    <div className="budget-card empty-card">
      <div className="budget-card-selector">
        <button className="budget-card-button disabled">
          Sélectionner un budget
        </button>
      </div>
      <div className="budget-card-operations">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher opérations..."
            className="search-input"
            disabled
          />
        </div>
        <div className="operations-table">
          <div className="table-header">
            <span>Libellé</span>
            <span>Montant</span>
            <span>Date</span>
            <span>Lieu</span>
          </div>
          <div className="table-row no-operations">
            <span>Aucun budget créé</span>
          </div>
        </div>
      </div>
      <div className="budget-card-actions">
        <button className="card-action-btn edit-btn disabled">
          Modifier le budget
        </button>
        <button className="card-action-btn delete-btn disabled">
          Supprimer
        </button>
      </div>
    </div>
  );

  const renderModal = (isEdit = false) => {
    const currentForm = isEdit ? editForm : form;
    const currentErrors = isEdit ? editFormErrors : formErrors;
    const currentValid = isEdit ? isEditFormValid : isFormValid;
    const updateCurrentForm = isEdit ? updateEditForm : updateForm;
    const submitAction = isEdit ? updateSelectedBudget : createNewBudget;
    const closeAction = isEdit ? closeEditModal : closeModal;

    return (
      <div className="modal-overlay" onClick={closeAction}>
        <div
          className="modal-content desktop-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={closeAction}>
            ×
          </button>
          <div className="modal-header">
            <h3>
              {isEdit
                ? `Modification du budget ${selectedBudget}`
                : `Nouveau budget pour ${currentMonth}`}
            </h3>
          </div>
          <div className="modal-body">
            <div className="modal-form-header">
              <span>
                Informations sur {isEdit ? "le" : "le nouveau"} budget
              </span>
            </div>
            <div className="modal-form-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom du budget</label>
                  <input
                    value={currentForm.nom}
                    onChange={(e) => updateCurrentForm("nom", e.target.value)}
                    placeholder="Ex: Pass Navigo, TGV..."
                    className={currentErrors.nom ? "input-error" : ""}
                    maxLength="50"
                  />
                  {renderFieldError("nom", currentErrors)}
                </div>
                <div className="form-group">
                  <label>Montant maximum</label>
                  <input
                    type="text"
                    value={currentForm.montant}
                    onChange={(e) =>
                      updateCurrentForm("montant", e.target.value)
                    }
                    placeholder="Ex: 150.50"
                    className={currentErrors.montant ? "input-error" : ""}
                  />
                  {renderFieldError("montant", currentErrors)}
                </div>
              </div>
              <div className="form-group">
                <label>Catégorie</label>
                <select
                  value={currentForm.categorie}
                  onChange={(e) =>
                    updateCurrentForm("categorie", e.target.value)
                  }
                  className={currentErrors.categorie ? "input-error" : ""}
                >
                  <option value="Choisir">Choisir</option>
                  {categoriesWithIds.map((cat) => (
                    <option key={cat.id} value={cat.nom_categorie}>
                      {cat.nom_categorie}
                    </option>
                  ))}
                </select>
                {renderFieldError("categorie", currentErrors)}
              </div>
            </div>
            <button
              className={`modal-validate ${!currentValid ? "disabled" : ""}`}
              onClick={submitAction}
              disabled={!currentValid}
            >
              {isEdit ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="budget-page">
      <Navbar />
      <div className="budget-container">
        <div className="month-nav">
          <button onClick={() => changeMonth(-1)}>‹</button>
          <span>{currentMonth}</span>
          <button onClick={() => changeMonth(1)}>›</button>
        </div>

        <div className="mobile-budget-selector">
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

          {selectedBudget && (
            <div className="budget-info">
              <p>
                Budget {selectedBudget} ({budgets[selectedBudget]?.categorie}) :{" "}
                {budgets[selectedBudget]?.montant}€
              </p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${getBudgetStats(selectedBudget).progressPercent}%`,
                    backgroundColor:
                      getBudgetStats(selectedBudget).progressColor,
                  }}
                />
              </div>
              <span>{getBudgetStats(selectedBudget).spent}€</span>
            </div>
          )}

          <div className="transactions">
            <div className="search-header">
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Rechercher opérations..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="search-input"
                  maxLength="100"
                />
                {isSearching && <span className="loading">⏳</span>}
              </div>
            </div>

            <div className="table-header">
              <span>Libellé</span>
              <span>Montant</span>
              <span>Date</span>
              <span>Lieu</span>
            </div>
            {(allOperations[selectedBudget] || []).map((t, i) => (
              <div key={i} className="table-row">
                <span className="table-libelle">{t.libelle}</span>
                <span className="table-montant">{t.price}€</span>
                <span className="table-date">{t.date}</span>
                <span className="table-lieu">{t.lieu}</span>
              </div>
            ))}
            {(allOperations[selectedBudget] || []).length === 0 &&
              selectedBudget && (
                <div className="table-row">
                  <span
                    style={{
                      textAlign: "center",
                      fontStyle: "italic",
                      opacity: 0.7,
                    }}
                  >
                    Aucune opération pour ce budget
                  </span>
                </div>
              )}
          </div>
        </div>

        <div className="desktop-budgets-container">
          {budgetEntries.length > 3 && (
            <button
              className="carousel-arrow carousel-prev"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              ‹
            </button>
          )}
          <div
            className="desktop-budgets-grid"
            data-card-count={
              budgetEntries.length === 0 ? "1" : budgetEntries.length.toString()
            }
          >
            {budgetEntries.length === 0
              ? renderEmptyCard()
              : getVisibleBudgets().map(([budgetName, budgetData]) =>
                  renderDesktopCard(budgetName, budgetData)
                )}
          </div>
          {budgetEntries.length > 3 && (
            <button
              className="carousel-arrow carousel-next"
              onClick={nextSlide}
              disabled={currentSlide >= maxSlides}
            >
              ›
            </button>
          )}
        </div>

        <div className="desktop-create-button">
          <button
            className="create-budget-btn"
            onClick={() => setShowModal(true)}
          >
            Créer un budget
          </button>
        </div>

        <div className="global-budget-actions">
          <button className="add-budget-btn" onClick={() => setShowModal(true)}>
            Ajouter un budget
          </button>
          <button
            className="edit-budget-btn"
            onClick={() => openEditModal(selectedBudget)}
            disabled={!selectedBudget}
          >
            Modifier le budget
          </button>
          <button
            className="delete-budget-btn"
            onClick={() => openDeleteModal(selectedBudget)}
            disabled={!selectedBudget}
          >
            Supprimer
          </button>
        </div>
      </div>

      {showModal && renderModal()}
      {showEditModal && renderModal(true)}

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

      <Footer />
    </div>
  );
};

export default Budget;
