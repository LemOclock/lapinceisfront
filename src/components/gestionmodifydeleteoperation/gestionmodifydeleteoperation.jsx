import './gestionmodifydeleteoperation.scss'
import "../../global.scss";
import { useState, useEffect } from 'react';
import { getAllCategories, updateOperationAccount, deleteOperationAccount } from '../../api/gestion';
import { findCompteId } from '../../api/gestion';




export default function GestionModifyDeleteOperationDepense({ operation, onClose, dateFR, onModify, refresh }) {
    const [categories, setCategories] = useState([])
    const [modifyDeleteOperationDepense, setModifyDeleteOperationDepense] = useState({
        montant_operation: "",
        nom_operation: "",
        moyen_paiement: "",
        lieu: "",
        date_operation: "",
        type_operation: '',
        compteId: "",
        categorieId: "",
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
        fetchCategories();
    }, []);


    useEffect(() => {
        if (operation.type_operation === 'depense') {
            setModifyDeleteOperationDepense({
                montant_operation: operation.montant_operation || "",
                nom_operation: operation.nom_operation || "",
                moyen_paiement: operation.moyen_paiement || "",
                lieu: operation.lieu || "",
                categorieId: operation.categorieId || "",
                type_operation: operation.type_operation || ""

            });
        }
        else if (operation.type_operation === 'revenu') {

            setModifyDeleteOperationDepense({
                montant_operation: operation.montant_operation || "",
                nom_operation: operation.nom_operation || "",
                moyen_paiement: operation.moyen_paiement || "",
                lieu: operation.lieu || "",
                categorieId: operation.categorieId || "",
                type_operation: operation.type_operation || ""
                
            });
        }
    }, [operation]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModifyDeleteOperationDepense(prev => ({ ...prev, [name]: value }));
    };


    const handleModifyOperationDepense = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Aucun token trouvé dans le localStorage.");
                return;
            }

            const compteId = await findCompteId();
            console.log("Compte ID trouvé :", compteId.data.id);

            const negatifOuPositif = (operation) => {
                if (operation.type_operation === 'depense') {
                    const montant = -Math.abs(modifyDeleteOperationDepense.montant_operation)
                    return montant
                 }
                 else if (operation.type_operation === 'revenu') {
                    const montant = Math.abs(modifyDeleteOperationDepense.montant_operation)
                    return montant
                 }

                 

            }

            const data = {
                ...modifyDeleteOperationDepense,
                compteId,
                montant_operation: negatifOuPositif(operation),
            };



            const response = await updateOperationAccount(operation.id, data);
            console.log("Dépense modifiée avec succès :", response.data);

            // Notifier le parent et fermer
            if (onModify) onModify();
            if (onClose) onClose();

        } catch (error) {
            console.error("Erreur lors de la modification de la dépense :", error);
        }
    };

    const deleteOperationDepense = async (e) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Aucun token trouvé dans le localStorage.");
                return;
            }

            const compteId = await findCompteId();
            console.log("Compte ID trouvé :", compteId.data.id);

            await deleteOperationAccount(operation.id);




            if (onModify) onModify();
            if (onClose) onClose();

        }
        catch (error) {
            console.error("Erreur lors de la suppression de la dépense :", error);
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
                    <form action="" onSubmit={handleModifyOperationDepense}>

                        <label>Nom</label>
                        <input
                            type="text"
                            name="nom_operation"
                            id="nom_operation"
                            onChange={handleInputChange}
                            value={modifyDeleteOperationDepense.nom_operation}
                        />

                        <label>Lieu</label>
                        <input
                            type="text"
                            name="lieu"
                            id="lieu"
                            onChange={handleInputChange}
                            value={modifyDeleteOperationDepense.lieu}
                        />
                        <label>Catégorie</label>
                        <select
                            name="categorieId"
                            id="categorieId"
                            placeholder="Catégorie"
                            onChange={handleInputChange}
                            value={modifyDeleteOperationDepense.categorieId}
                            required
                        >
                            <option value="">Catégorie</option>
                            {modifyDeleteOperationDepense.type_operation === "depense" &&

                                categories.slice(7).map((categorie) => (
                                    <option key={categorie.id} value={categorie.id}>
                                        {categorie.icone + ' ' + categorie.nom_categorie}
                                    </option>
                                ))}
                            {modifyDeleteOperationDepense.type_operation === "revenu" &&
                                categories.slice(0, 7).map((categorie) => (
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
                                value={modifyDeleteOperationDepense.montant_operation}
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
                            value={modifyDeleteOperationDepense.moyen_paiement}
                        />
                        <div className="ajoutoperation">
                            <button type="submit" className="buttonbleu">
                                Modifier la dépense
                            </button>
                        </div>

                    </form>
                    <div className="supressionoperation">
                        <button className="supressionbutton" onClick={deleteOperationDepense}>
                            Supprimer la dépense
                        </button>
                    </div>
                </div>

            </div >
        </div >

    )
}

