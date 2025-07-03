
{/* Modale Ajouter une dépense */ }
{
    showAddExpenseModal && (
        <div
            className="popup-overlay"
            onClick={closeModal(setShowAddExpenseModal, setExpenseForm)}
        >
            <div
                className="add-expense-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="closepopup"
                    onClick={closeModal(setShowAddExpenseModal, setExpenseForm)}
                >
                    ×
                </button>

                <div className="modal-header">
                    <h3>
                        {popupInfo
                            ? popupInfo.date
                            : new Date().toLocaleDateString("fr")}
                    </h3>
                </div>

                <div className="modal-section">
                    <h4 className="aaaa">Information du revenu</h4>

                    <div className="image-upload">
                        <div className="upload-circle"></div>
                    </div>

                    <div className="form-group">
                        <label>Libellé</label>
                        <input
                            type="text"
                            value={expenseForm.libelle}
                            onChange={(e) =>
                                handleFormChange(expenseForm, setExpenseForm)(
                                    "libelle",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Montant</label>
                        <input
                            type="number"
                            value={expenseForm.montant}
                            onChange={(e) =>
                                handleFormChange(expenseForm, setExpenseForm)(
                                    "montant",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Catégorie</label>
                        <div className="category-selector">
                            <button
                                className="category-button"
                                onClick={() => setShowCategories(!showCategories)}
                            >
                                {expenseForm.categorie} ▼
                            </button>
                            {showCategories && (
                                <div className="category-dropdown">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                handleFormChange(expenseForm, setExpenseForm)(
                                                    "categorie",
                                                    cat
                                                );
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

                    <button className="add-button" onClick={handleAddExpense}>
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    )
}




{/* Modale Modifier une transaction */ }
{
    showModifyModal && (
        <div
            className="popup-overlay"
            onClick={closeModal(setShowModifyModal, setModifyForm)}
        >
            <div
                className="add-expense-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="closepopup"
                    onClick={closeModal(setShowModifyModal, setModifyForm)}
                >
                    ×
                </button>

                <div className="modal-header">
                    <h3>
                        {popupInfo
                            ? popupInfo.date
                            : new Date().toLocaleDateString("fr")}
                    </h3>
                </div>




                <div className="modal-section">
                    <h4>Information du revenu</h4>

                    <div className="image-upload">
                        <div className="upload-circle">
                            <span>Image du revenu</span>
                        </div>
                        <div className="edit-icon">✏️</div>
                    </div>

                    <div className="form-group">
                        <label>Libellé</label>
                        <input
                            type="text"
                            value={modifyForm.libelle}
                            onChange={(e) =>
                                handleFormChange(modifyForm, setModifyForm)(
                                    "libelle",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Montant</label>
                        <input
                            type="number"
                            value={modifyForm.montant}
                            onChange={(e) =>
                                handleFormChange(modifyForm, setModifyForm)(
                                    "montant",
                                    e.target.value
                                )
                            }
                        />
                        <span className="currency">€</span>
                    </div>

                    <div className="form-group">
                        <label>Catégorie</label>
                        <div className="category-selector">
                            <button
                                className="category-button"
                                onClick={() => setShowCategories(!showCategories)}
                            >
                                {modifyForm.categorie} ▼
                            </button>
                            {showCategories && (
                                <div className="category-dropdown">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                handleFormChange(modifyForm, setModifyForm)(
                                                    "categorie",
                                                    cat
                                                );
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

                    <button
                        className="modify-button"
                        onClick={handleModifyTransaction}
                    >
                        Modifier
                    </button>
                    <button
                        className="delete-button"
                        onClick={() => setShowDeleteConfirmModal(true)}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    )
}

{/* Modale de confirmation de suppression */ }
{
    showDeleteConfirmModal && (
        <div
            className="popup-overlay"
            onClick={() => setShowDeleteConfirmModal(false)}
        >
            <div
                className="delete-confirm-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="closepopup"
                    onClick={() => setShowDeleteConfirmModal(false)}
                >
                    ×
                </button>

                <div className="delete-confirm-content">
                    <p>Êtes vous sûres de vouloir supprimer ce revenu ?</p>
                    <button
                        className="confirm-delete-button"
                        onClick={handleDeleteTransaction}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    )
}