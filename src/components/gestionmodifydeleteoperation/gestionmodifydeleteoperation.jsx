import './gestionmodifydeleteoperation.scss'
import "../../global.scss";
import { useState, useEffect } from 'react';




export default function GestionModifyDeleteOperation({ operation, onClose}) {
    const [modifyDeleteOperation, setModifyDeleteOperation] = useState(false);




    return (

        <div className='popup-overlay'>
            <div className='popup'>
                <button className="closepopup" onClick={onClose}>
                ×
                </button>
                <p>{}</p>
            </div>
        </div>


        //     <div className="popup-overlay">
        //         <div className="popup">
        //             <button className="closepopup" onClick={onClose}>
        //                 ×
        //             </button>

        //             <div className="popup-header">
        //                 <h3>{dateFR}</h3>
        //             </div>

        //             <div className="popup-content">
        //                 <form onSubmit={handleAddExpense}>
        //                     <label>Nom</label>
        //                     <input
        //                         type="text"
        //                         name="nom_operation"
        //                         id="nom_operation"
        //                         placeholder="Nom"
        //                         onChange={handleInputChange}
        //                         value={expenseForm.nom_operation}
        //                         required
        //                     />

        //                     <label>Lieu</label>
        //                     <input
        //                         type="text"
        //                         name="lieu"
        //                         id="lieu"
        //                         placeholder="Lieu"
        //                         onChange={handleInputChange}
        //                         value={expenseForm.lieu}
        //                     />

        //                     <label>Catégorie</label>
        //                     <select
        //                         name="categorieId"
        //                         id="categorieId"
        //                         placeholder="Catégorie"
        //                         onChange={handleInputChange}
        //                         value={expenseForm.categorieId}
        //                         required
        //                     >
        //                         <option value="">Choisissez une catégorie</option>
        //                         {categories.slice(7).map((categorie) => (
        //                             <option key={categorie.id} value={categorie.id}>
        //                                 {categorie.icone + ' ' + categorie.nom_categorie}
        //                             </option>
        //                         ))}
        //                     </select>

        //                     <label>Montant</label>
        //                     <div className="montant-depense">
        //                         <input
        //                             type="number"
        //                             name="montant_operation"
        //                             id="montant_operation"
        //                             placeholder="Montant"
        //                             onChange={handleInputChange}
        //                             value={expenseForm.montant_operation}
        //                             required
        //                         />
        //                     </div>

        //                     <label>Moyen de paiement</label>
        //                     <input
        //                         type="text"
        //                         name="moyen_paiement"
        //                         id="moyen_paiement"
        //                         placeholder="Moyen de paiement"
        //                         onChange={handleInputChange}
        //                         value={expenseForm.moyen_paiement}
        //                     />

        //                     <div className="ajoutoperation">
        //                         <button type="submit" className="buttonbleu">
        //                             Modifier la dépense
        //                         </button>
        //                     </div>
        //                 </form>
        //             </div>
        //         </div>
        //     </div>
    )




}

