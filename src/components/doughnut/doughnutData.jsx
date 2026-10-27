import { useEffect, useState } from 'react';
import { getAllOperationsAccount } from '../../api/gestion';

const COLORS = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)'
];

// Total des dépenses et des revenus de l'utilisateur
export default function Data() {
    const [data, setData] = useState({
        labels: ['Dépenses', 'Revenus'],
        datasets: [
            {
                label: '',
                data: [0, 0],
                backgroundColor: COLORS,
                hoverOffset: 4,
            }
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllOperationsAccount();

                let totalDepenses = 0;
                let totalRevenus = 0;
                for (const operation of response.data) {
                    const montant = Math.abs(parseFloat(operation.montant_operation));
                    if (operation.type_operation === 'depense') totalDepenses += montant;
                    else if (operation.type_operation === 'revenu') totalRevenus += montant;
                }

                setData({
                    labels: ['Dépenses', 'Revenus'],
                    datasets: [
                        {
                            label: '',
                            data: [totalDepenses, totalRevenus],
                            backgroundColor: COLORS,
                            hoverOffset: 4,
                        }
                    ],
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des opérations :", error);
            }
        };
        fetchData();
    }, []);

    return data;
}
