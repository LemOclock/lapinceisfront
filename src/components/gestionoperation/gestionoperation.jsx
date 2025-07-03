import "./gestionoperation.scss";
import "../../global.scss";
import { useState, useEffect } from 'react';
import { sendForm, findCompteId, getAllCategories } from '../../api/gestion';
import { log } from "console";

export function GestionDepense({ selectedDate, onClose, onExpenseAdded, dateFR}) {
    
    const [categories, setCategories] = useState([]);
    const [expenseForm, setExpenseForm] = useState({
        montant_operation: "",
        nom_operation: "",
        moyen_paiement: "",
        lieu: "",
        date_operation: selectedDate || "",
        type_operation: 'depense',
        compteId: "",
        categorieId: "",
        image_operation: ""
    });

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            setExpenseForm(prev => ({ ...prev, date_operation: selectedDate }));
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpenseForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Aucun token trouvé dans le localStorage.");
                return;
            }

            const compteId = await findCompteId();
            console.log("Compte ID trouvé :", compteId);

            const expenseData = {
                ...expenseForm,
                compteId,
                montant_operation: -Math.abs(parseFloat(expenseForm.montant_operation)),
            };

            const response = await sendForm(expenseData);
            console.log("Dépense ajoutée avec succès :", response.data);

            // Réinitialiser le formulaire
            setExpenseForm({
                montant_operation: "",
                nom_operation: "",
                moyen_paiement: "",
                lieu: "",
                date_operation: selectedDate || "",
                type_operation: 'depense',
                compteId: "",
                categorieId: "",
                image_operation: ""
            });

            // Notifier le parent et fermer
            if (onExpenseAdded) onExpenseAdded();
            if (onClose) onClose();

        } catch (error) {
            console.error("Erreur lors de l'ajout de la dépense :", error);
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
                        <label>Nom</label>
                        <input
                            type="text"
                            name="nom_operation"
                            id="nom_operation"
                            placeholder="Nom"
                            onChange={handleInputChange}
                            value={expenseForm.nom_operation}
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
                        />

                        <label>Catégorie</label>
                        <select
                            name="categorieId"
                            id="categorieId"
                            placeholder="Catégorie"
                            onChange={handleInputChange}
                            value={expenseForm.categorieId}
                            required
                        >
                            <option value="">Choisissez une catégorie</option>
                            {categories.slice(7).map((categorie) => (
                                <option key={categorie.id} value={categorie.id}>
                                    {categorie.icone + ' ' + categorie.nom_categorie}
                                </option>
                            ))}
                        </select>

                        <label>Montant</label>
                        <div className="montant-depense">
                            <input
                                type="number"
                                name="montant_operation"
                                id="montant_operation"
                                placeholder="Montant"
                                onChange={handleInputChange}
                                value={expenseForm.montant_operation}
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
                        />

                        <div className="ajoutoperation">
                            <button type="submit" className="buttonbleu">
                                Ajouter la dépense
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}



// -------------------------------------------------------



export function GestionRevenu({ selectedDate, onClose, onExpenseAdded, dateFR }) {
    const [categories, setCategories] = useState([]);
    const [expenseForm, setExpenseForm] = useState({
        montant_operation: "",
        nom_operation: "",
        moyen_paiement: "",
        lieu: "",
        date_operation: selectedDate || "",
        type_operation: 'revenu',
        compteId: "",
        categorieId: "",
        image_operation: ""
    });

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            setExpenseForm(prev => ({ ...prev, date_operation: selectedDate }));
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpenseForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Aucun token trouvé dans le localStorage.");
                return;
            }

            const compteId = await findCompteId();
            console.log("Compte ID trouvé :", compteId);

            const expenseData = {
                ...expenseForm,
                compteId,
                montant_operation: Math.abs(parseFloat(expenseForm.montant_operation)),
            };
            
            

            const response = await sendForm(expenseData);
            console.log("Dépense ajoutée avec succès :", response.data);

            // Réinitialiser le formulaire
            setExpenseForm({
                montant_operation: "",
                nom_operation: "",
                moyen_paiement: "",
                lieu: "",
                date_operation: selectedDate || "",
                type_operation: 'depense',
                compteId: "",
                categorieId: "",
                image_operation: ""
            });

            // Notifier le parent et fermer
            if (onExpenseAdded) onExpenseAdded();
            if (onClose) onClose();

        } catch (error) {
            console.error("Erreur lors de l'ajout de la dépense :", error);
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
                        <label>Nom</label>
                        <input
                            type="text"
                            name="nom_operation"
                            id="nom_operation"
                            placeholder="Nom"
                            onChange={handleInputChange}
                            value={expenseForm.nom_operation}
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
                        />

                        <label>Catégorie</label>
                        <select
                            name="categorieId"
                            id="categorieId"
                            placeholder="Catégorie"
                            onChange={handleInputChange}
                            value={expenseForm.categorieId}
                            required
                        >
                            <option value="">Choisissez une catégorie</option>
                            {categories.slice(0,7).map((categorie) => (
                                <option key={categorie.id} value={categorie.id}>
                                    {categorie.icone + ' ' + categorie.nom_categorie}
                                </option>
                            ))}
                        </select>

                        <label>Montant</label>
                        <div className="montant-revenu">
                            <input
                                type="number"
                                name="montant_operation"
                                id="montant_operation"
                                placeholder="Montant"
                                onChange={handleInputChange}
                                value={expenseForm.montant_operation}
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
                        />

                        <div className="ajoutoperation">
                            <button type="submit" className="buttonbleu">
                                Ajouter un revenu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
