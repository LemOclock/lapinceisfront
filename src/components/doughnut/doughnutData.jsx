import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { getOperationsByIdAccount, findCompteId } from '../../api/gestion';

export default function Data() {
    // Initialisez avec des données par défaut au lieu de null
    const [data, setData] = useState({
        labels: ['Dépenses', 'Revenus'],
        datasets: [
            {
                label: '',
                data: [0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)'
                ],
                hoverOffset: 4,
            }
        ],
    });
    const [userAccount, setUserAccount] = useState({
        solde_initial: '',
    });

    const decodeToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
            return null;
        }
    };

    const handleCompteUser = async () => {
        try {
            const userId = decodeToken(localStorage.getItem("token"));
            const response = await findCompteId(userId);
            console.log(response.data);

            const soldeInitial = parseFloat(response.data.solde_initial)
            setUserAccount({
                solde_initial: soldeInitial,

            });

            console.log('non non ' + response.data.solde_initial);
            console.log('oui oui ' + userAccount.solde_initial);

        } catch (error) {
            console.error("Erreur lors de la récupération des informations du compte :", error);
        }
    };
    useEffect(() => {
        handleCompteUser();
    }, []);



    useEffect(() => {

        const fetchData = async () => {
            const compteId = findCompteId();
            const response = await getOperationsByIdAccount(compteId);
            const data = response.data

            // console.log('oui '+ JSON.stringify(result)); // pour voir les données reçues

            let totalDepenses = 0;
            for (const operation of data) {
                if (operation.type_operation === 'depense') {
                    totalDepenses += parseFloat(operation.montant_operation);
                }
            }

            let totalRevenus = 0;
            for (const operation of data) {
                if (operation.type_operation === 'revenu') {
                    totalRevenus += parseFloat(operation.montant_operation);
                }
            }

            let total = totalDepenses + totalRevenus;

            setData({
                labels: ['Dépenses', 'Revenus'],
                datasets: [
                    {
                        label: '',
                        data: [Math.abs(totalDepenses), totalRevenus + userAccount.solde_initial],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)'
                        ],
                        hoverOffset: 4,
                    }
                ],
            }

            );
        };
        fetchData();
    }, []);


    return data;
}

















