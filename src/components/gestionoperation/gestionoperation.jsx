import "./gestionoperation.scss";
import "../../global.scss";
import { useState, useEffect } from "react";
import { sendForm, getAllCategories } from "../../api/gestion";
import { getErrorMessage } from "../../api/api";

const emptyForm = (type, date) => ({
  montant_operation: "",
  nom_operation: "",
  moyen_paiement: "",
  lieu: "",
  date_operation: date || "",
  type_operation: type,
  categorieId: "",
});

// Formulaire commun d'ajout d'une opération (dépense ou revenu)
function OperationForm({ type, selectedDate, onClose, onExpenseAdded, dateFR }) {
  const isDepense = type === "depense";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [expenseForm, setExpenseForm] = useState(emptyForm(type, selectedDate));

  useEffect(() => {
    getAllCategories()
      .then((response) =>
        setCategories(response.data.filter((categorie) => categorie.type_categorie === type))
      )
      .catch((err) => console.error("Erreur lors de la récupération des catégories :", err));
  }, [type]);

  useEffect(() => {
    if (selectedDate) {
      setExpenseForm((prev) => ({ ...prev, date_operation: selectedDate }));
    }
  }, [selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      // Le back applique le signe selon le type (dépense négative, revenu positif)
      await sendForm({
        ...expenseForm,
        montant_operation: Math.abs(parseFloat(expenseForm.montant_operation)),
      });

      setExpenseForm(emptyForm(type, selectedDate));
      if (onExpenseAdded) onExpenseAdded();
      if (onClose) onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Impossible d'ajouter l'opération."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="closepopup" onClick={onClose}>
          ×
        </button>

        <div className="popup-header">
          <h3>{dateFR}</h3>
        </div>

        <div className="popup-content">
          <form onSubmit={handleAddExpense}>
            {error && <p className="form-error" role="alert">{error}</p>}

            <label>Nom</label>
            <input
              type="text"
              name="nom_operation"
              id="nom_operation"
              placeholder="Nom"
              onChange={handleInputChange}
              value={expenseForm.nom_operation}
              maxLength="150"
              required
            />

            <label>Lieu</label>
            <input
              type="text"
              name="lieu"
              id="lieu"
              placeholder="Lieu"
              onChange={handleInputChange}
              value={expenseForm.lieu}
              maxLength="100"
            />

            <label>Catégorie</label>
            <select
              name="categorieId"
              id="categorieId"
              onChange={handleInputChange}
              value={expenseForm.categorieId}
              required
            >
              <option value="">Choisissez une catégorie</option>
              {categories.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.icone + " " + categorie.nom_categorie}
                </option>
              ))}
            </select>

            <label>Montant</label>
            <div className={isDepense ? "montant-depense" : "montant-revenu"}>
              <input
                type="number"
                name="montant_operation"
                id="montant_operation"
                placeholder="Montant"
                onChange={handleInputChange}
                value={expenseForm.montant_operation}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <label>Moyen de paiement</label>
            <input
              type="text"
              name="moyen_paiement"
              id="moyen_paiement"
              placeholder="Moyen de paiement"
              onChange={handleInputChange}
              value={expenseForm.moyen_paiement}
              maxLength="30"
            />

            <div className="ajoutoperation">
              <button
                type="submit"
                className="buttonbleu"
                disabled={isSubmitting}
              >
                {isDepense ? "Ajouter la dépense" : "Ajouter un revenu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function GestionDepense(props) {
  return <OperationForm type="depense" {...props} />;
}

// -------------------------------------------------------

export function GestionRevenu(props) {
  return <OperationForm type="revenu" {...props} />;
}
