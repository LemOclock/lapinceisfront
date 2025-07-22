import Style from './alertes.scss';
import { useEffect, useState } from 'react';
import { getUserBudgets } from '../../api/budgetApi';
import { log } from 'console';

export default function Alertes() {
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await getUserBudgets();
                const budgetData = response.data.budgets;

                const budgetsArray = Object.values(budgetData);
                setBudgets(budgetsArray);



            } catch (err) {
                console.error('Erreur lors du chargement des budgets:', err);
            }
        };
        console.log('Budgets:', budgets);

        fetchBudgets();
    }, []);

    return (
        <div className='alertesbudgets'>
            <h3>Mes alertes</h3>
            <a href="/budget">
                <button>Voir les budgets</button>
            </a>
                {/* probleme de la table alerte on va faire un appel api mais je vois mal l'utilité  */}


            <div className='alertes-container'>

                { budgets.map((budget) => {
                    if (budget.seuil_pourcentage > 50 && budget.seuil_pourcentage <= 80) {
                        return (
                            <p className='low-alert' key={budget.id}>
                                Votre budget {budget.nom} est en bonne santé.
                            </p>
                        );
                    }
                    else if (budget.seuil_pourcentage > 80 && budget.seuil_pourcentage < 100) {
                        return (
                            <p className='medium-alert' key={budget.id}>
                                Votre budget {budget.nom} est en alerte.
                            </p>
                        );
                    }
                    else if (budget.seuil_pourcentage === 100) {
                        return (
                            <p className='high-alert' key={budget.id}>
                                Votre budget {budget.nom} est en situation critique.
                            </p>
                        );
                    }
                    return null;
                }) }
            </div>
          
        </div>
    );
}
