import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/Footer/footer';
import Alertes from '../../components/alertes/alertes';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import React, { useState, useEffect } from 'react';
import { getUtilisateurById } from '../../api/profil';
import { findCompteId } from '../../api/gestion';
import moment from 'moment';
import './dashboard.scss';
import '../../global.scss';
import { getOperationsByMonth } from '../../api/gestion';

const localizer = momentLocalizer(moment);

export default function Dashboard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthlyOperations, setMonthlyOperations] = useState([]);
    const [userAccount, setUserAccount] = useState({

        solde_compte: "",
        nom_account: "",
    });

    const [userData, setUserData] = useState({
        nom: "",
        prenom: "",
    });

    const loadMonthlyOperations = async () => {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        try {
            const operations = await getOperationsByMonth(month, year);
            console.log("Opérations du mois récupérées :", operations.data);

            const operationEvents = operations.data.map(operation => ({
                id: operation.id,
                date: new Date(operation.date_operation),
                icone: operation.Categorie?.icone || '💰',
            }));

            setMonthlyOperations(operationEvents);
            console.log('toute les op' + operationEvents);

        } catch (error) {
            console.error("Erreur:", error);
        }
    };
    useEffect(() => {
        loadMonthlyOperations();
    }, [currentDate]);


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

            setUserAccount({
                nom_account: response.data.nom_compte,
                solde_compte: response.data.solde_courant,

            });

        } catch (error) {
            console.error("Erreur lors de la récupération des informations du compte :", error);
        }
    };

    useEffect(() => {
        handleCompteUser();
    }, []);


    const handleUserInfos = async () => {
        try {
            const userId = decodeToken(localStorage.getItem("token"));
            const response = await getUtilisateurById(userId);
            setUserData({
                prenom: response.data.prenom,
            });

        }
        catch (error) {
            console.error("Erreur lors de la récupération des informations utilisateur :", error);
        }
    };

    useEffect(() => {
        handleUserInfos();
    }, []);

    const goToPrevWeek = () => {
        setCurrentDate(prev => moment(prev).subtract(1, 'week').toDate());
    };
    const goToNextWeek = () => {
        setCurrentDate(prev => moment(prev).add(1, 'week').toDate());
    };

    const CustomToolbar = ({ label }) => (
        <div className="rbc-toolbar">
            <button className="calendar-arrow" onClick={goToPrevWeek} aria-label="Semaine précédente">
                &#8592;
            </button>
            <span className="rbc-toolbar-label">{label}</span>
            <button className="calendar-arrow" onClick={goToNextWeek} aria-label="Semaine suivante">
                &#8594;
            </button>
        </div>
    );



    const CustomHeaderContent = ({ date }) => (
        <div className="rbc-time-header-content">
            <div className='rbc-allday-cell'>
                <div className='date'>{date}</div>
                <div className='icons'></div>
            </div>


        </div>



    )

    const CustomDateCellWrapper = ({ children, value }) => {
        // Filtrer les opérations pour cette date spécifique SEULEMENT
        const dayOperations = monthlyOperations.filter(operation => {
            // operation.date est déjà un objet Date, pas besoin de new Date()
            return operation.date.toDateString() === value.toDateString();
        }); 

        const dayNumber = moment(value).format('DD');
        const dayLetter = moment(value).format('ddd');
        const handleClick = () => {
            const slotInfo = { start: value }
            getOperationBy(slotInfo); // Appel de la fonction pour récupérer les opérations de cette date
        }





        return (

            <div className="custom-date-cell-wrapper">
                <div className='date'>{dayNumber} {dayLetter}</div>
                {/* Afficher SEULEMENT les opérations de cette date */}
                {dayOperations.length > 0 && (
                    <div className="operation-icons">
                        {dayOperations.slice(0, 2).map((operation, index) => (
                            <span key={index} className="operation-icon" title={operation.nom}>
                                {operation.icone}
                            </span>
                        ))}
                        {dayOperations.length > 2 && (
                            <span className="more-operations">+{dayOperations.length - 2}</span>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <main>


                <div className='container-title'>
                    <h1>Bienvenue {userData.prenom} {userData.nom} !</h1>

                </div>
                <div className='container-account'>
                    <p className='nomaccount buttonbleu'>{userAccount.nom_account}</p>
                </div>
                <div
                    className={
                        "container-solde " +
                        (parseFloat(userAccount.solde_compte) >= 0 ? "solde-positive" : "solde-negative")
                    }
                >
                    <p className='soldeaccount'>{userAccount.solde_compte}</p>
                </div>

                <div className='container-calendar'>



                    <Calendar
                        views={""}
                        view='week'
                        localizer={localizer}
                        date={currentDate}
                        onNavigate={setCurrentDate}
                        components={{
                            toolbar: CustomToolbar,
                            timeSlotWrapper: () => null, // Supprime les créneaux horaires
                            timeGutterHeader: () => null, // Supprime l'en-tête des heures
                            dateCellWrapper: CustomDateCellWrapper,
                            header: () => null,
                                                                            
                        }}
                    />

                </div>



                <div className='container-buttons'>
                    <a href="/account">
                        <button className='buttonbleu'>Accédez à vos comptes</button>
                    </a>
                    <a href="/budget">
                        <button className='buttonbleu'>Accédez à vos budgets</button>
                    </a>
                </div>









            </main>
            <Footer />
        </>
    )
}
