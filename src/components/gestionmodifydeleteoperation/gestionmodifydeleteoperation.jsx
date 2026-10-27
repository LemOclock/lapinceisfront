import './gestionmodifydeleteoperation.scss'
import "../../global.scss";
import { useState, useEffect } from 'react';
import { getAllCategories, updateOperationAccount, deleteOperationAccount } from '../../api/gestion';
import { getErrorMessage } from '../../api/api';


export default function GestionModifyDeleteOperation({ operation, onClose, dateFR, onModify }) {
    const isDepense = operation.type_operation === 'depense';
    const libelle = isDepense ? "la dépense" : "le revenu";
    const [categories, setCategories] = useState([])
    const [error, setError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [form, setForm] = useState({
        montant_operation: "",
        nom_operation: "",
        moyen_paiement: "",
        lieu: "",
        categorieId: "",
    });

    useEffect(() => {
        getAllCategories()
            .then((response) =>
                setCategories(response.data.filter((categorie) => categorie.type_categorie === operation.type_operation))
            )
            .catch((err) => console.error("Erreur lors de la récupération des catégories :", err));
    }, [operation.type_operation]);

    useEffect(() => {
        setForm({
            montant_operation: operation.montant_operation ? Math.abs(parseFloat(operation.montant_operation)) : "",
            nom_operation: operation.nom_operation || "",
            moyen_paiement: operation.moyen_paiement || "",
            lieu: operation.lieu || "",
            categorieId: operation.categorieId || "",
        });
    }, [operation]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleModify = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Le back applique le signe selon le type de l'opération
            await updateOperationAccount(operation.id, {
                ...form,
                montant_operation: Math.abs(parseFloat(form.montant_operation)),
            });

            if (onModify) onModify();
            if (onClose) onClose();
        } catch (err) {
            setError(getErrorMessage(err, "Impossible de modifier l'opération."));
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        setError("");
        try {
            await deleteOperationAccount(operation.id);
            if (onModify) onModify();
            if (onClose) onClose();
        }
        catch (err) {
            setError(getErrorMessage(err, "Impossible de supprimer l'opération."));
        }
    }

    return (

        <div className='popup-overlay'>
            <div className='popup'>
                <button className="closepopup" onClick={onClose}>
                    ×
                </button>
                <div className="popup-header">
                    <h3>{dateFR}</h3>
                </div>
                <div className='popup-content'>
                    <form onSubmit={handleModify}>
                        {error && <p className="form-error" role="alert">{error}</p>}

                        <label>Nom</label>
                        <input
                            type="text"
                            name="nom_operation"
                            id="nom_operation"
                            onChange={handleInputChange}
                            value={form.nom_operation}
                            maxLength="150"
                            required
                        />

                        <label>Lieu</label>
                        <input
                            type="text"
                            name="lieu"
                            id="lieu"
                            onChange={handleInputChange}
                            value={form.lieu}
                            maxLength="100"
                        />
                        <label>Catégorie</label>
                        <select
                            name="categorieId"
                            id="categorieId"
                            onChange={handleInputChange}
                            value={form.categorieId}
                            required
                        >
                            <option value="">Catégorie</option>
                            {categories.map((categorie) => (
                                <option key={categorie.id} value={categorie.id}>
                                    {categorie.icone + ' ' + categorie.nom_categorie}
                                </option>
                            ))}
                        </select>

                        <label>Montant</label>
                        <div>
                            <input
                                type="number"
                                name="montant_operation"
                                id="montant_operation"
                                placeholder="Montant"
                                onChange={handleInputChange}
                                value={form.montant_operation}
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
                            value={form.moyen_paiement}
                            maxLength="30"
                        />
                        <div className="ajoutoperation">
                            <button type="submit" className="buttonbleu">
                                Modifier {libelle}
                            </button>
                        </div>

                    </form>
                    <div className="supressionoperation">
                        <button className="supressionbutton" onClick={handleDelete}>
                            {confirmDelete ? "Confirmer la suppression" : `Supprimer ${libelle}`}
                        </button>
                    </div>
                </div>

            </div >
        </div >

    )
}
