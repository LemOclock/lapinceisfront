import './alertes.scss';
import { useEffect, useState } from 'react';
import { getUserBudgets } from '../../api/budgetApi';

// Alertes sur les budgets du mois en cours (pourcentage calculé par l'API)
export default function Alertes() {
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await getUserBudgets();
                const now = new Date();
                const budgetsArray = Object.values(response.data.budgets || {}).filter(
                    (budget) => budget.mois === now.getMonth() + 1 && budget.annee === now.getFullYear()
                );
                setBudgets(budgetsArray);
            } catch (err) {
                console.error('Erreur lors du chargement des budgets:', err);
            }
        };

        fetchBudgets();
    }, []);

    const hasAlertes = budgets.some(budget => budget.pourcentage > 50);

    if (!hasAlertes) {
        return null;
    }

    return (
        <div className='alertesbudgets'>
            <h3>Mes alertes</h3>
            <a href="/budget">
                <button>Voir les budgets</button>
            </a>

            <div className='alertes-container'>
                { budgets.map((budget) => {
                    if (budget.pourcentage > 50 && budget.pourcentage <= 80) {
                        return (
                            <p className='low-alert' key={budget.id}>
                                Vous avez utilisé {budget.pourcentage}% de votre budget {budget.nom}.
                            </p>
                        );
                    }
                    else if (budget.pourcentage > 80 && budget.pourcentage < 100) {
                        return (
                            <p className='medium-alert' key={budget.id}>
                                Votre budget {budget.nom} est en alerte ({budget.pourcentage}%).
                            </p>
                        );
                    }
                    else if (budget.pourcentage >= 100) {
                        return (
                            <p className='high-alert' key={budget.id}>
                                Votre budget {budget.nom} est dépassé ({budget.pourcentage}%).
                            </p>
                        );
                    }
                    return null;
                }) }
            </div>
        </div>
    );
}
