import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import Alertes from "../../components/alertes/alertes";
import { Calendar, momentLocalizer } from "react-big-calendar";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../api/profil";
import { findCompteId, getOperationsByMonth } from "../../api/gestion";
import moment from "moment";
import "./dashboard.scss";
import "../../global.scss";
import Doughnut from "../../components/doughnut/doughnut";

const localizer = momentLocalizer(moment);

// Date "AAAA-MM-JJ" -> Date locale (évite le décalage UTC de new Date("AAAA-MM-JJ"))
const parseLocalDate = (value) => {
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyOperations, setMonthlyOperations] = useState([]);
  const [userAccount, setUserAccount] = useState({
    solde_compte: "",
    nom_account: "",
    devise: "EUR",
  });

  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
  });

  // Charge les opérations des mois couverts par la semaine affichée
  const loadMonthlyOperations = async () => {
    const start = moment(currentDate).startOf("week");
    const end = moment(currentDate).endOf("week");
    const months = [[start.month() + 1, start.year()]];
    if (start.month() !== end.month()) months.push([end.month() + 1, end.year()]);

    try {
      const responses = await Promise.all(
        months.map(([month, year]) => getOperationsByMonth(month, year))
      );
      const operationEvents = responses.flatMap((response) =>
        response.data.map((operation) => ({
          id: operation.id,
          date: parseLocalDate(operation.date_operation),
          icone: operation.Categorie?.icone || "💰",
          nom: operation.nom_operation,
        }))
      );

      setMonthlyOperations(operationEvents);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  useEffect(() => {
    loadMonthlyOperations();
  }, [currentDate]);

  const handleCompteUser = async () => {
    try {
      const response = await findCompteId();

      setUserAccount({
        nom_account: response.data.nom_compte,
        solde_compte: response.data.solde_courant,
        devise: response.data.devise || "EUR",
      });
    } catch (error) {
      // Pas encore de compte bancaire : on envoie vers la configuration
      if (error.response?.status === 404) {
        navigate("/config");
        return;
      }
      console.error(
        "Erreur lors de la récupération des informations du compte :",
        error
      );
    }
  };

  useEffect(() => {
    handleCompteUser();
  }, []);

  const handleUserInfos = async () => {
    try {
      const response = await getMe();
      setUserData({
        prenom: response.data.prenom,
        nom: response.data.nom,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur :",
        error
      );
    }
  };

  useEffect(() => {
    handleUserInfos();
  }, []);

  const goToPrevWeek = () => {
    setCurrentDate((prev) => moment(prev).subtract(1, "week").toDate());
  };
  const goToNextWeek = () => {
    setCurrentDate((prev) => moment(prev).add(1, "week").toDate());
  };

  const CustomToolbar = ({ label }) => (
    <div className="rbc-toolbar">
      <button
        className="calendar-arrow"
        onClick={goToPrevWeek}
        aria-label="Semaine précédente"
      >
        &#8592;
      </button>
      <span className="rbc-toolbar-label">{label}</span>
      <button
        className="calendar-arrow"
        onClick={goToNextWeek}
        aria-label="Semaine suivante"
      >
        &#8594;
      </button>
    </div>
  );

  const CustomDateCellWrapper = ({ children, value }) => {
    // Filtrer les opérations pour cette date spécifique SEULEMENT
    const dayOperations = monthlyOperations.filter((operation) => {
      // operation.date est déjà un objet Date, pas besoin de new Date()
      return operation.date.toDateString() === value.toDateString();
    });

    const dayNumber = moment(value).format("DD");
    const dayLetter = moment(value).format("ddd");

    const isToday = new Date().toDateString() === value.toDateString();

    return (
      <div className={`custom-date-cell-wrapper ${isToday ? "is-today" : ""}`}>
        <div className="date">
          {dayNumber} {dayLetter}
        </div>
        {/* Afficher SEULEMENT les opérations de cette date */}
        {dayOperations.length > 0 && (
          <div className="operation-icons">
            {dayOperations.slice(0, 2).map((operation, index) => (
              <span
                key={index}
                className="operation-icon"
                title={operation.nom}
              >
                {operation.icone}
              </span>
            ))}
            {dayOperations.length > 2 && (
              <span className="more-operations">
                +{dayOperations.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <Alertes />
      <main>
        <div className="container-title">
          <h1>
            Bienvenue {userData.prenom} {userData.nom} !
          </h1>
        </div>
        <div className="container-account">
          <p className="nomaccount buttonbleu">{userAccount.nom_account}</p>
        </div>
        <div
          className={
            "container-solde " +
            (parseFloat(userAccount.solde_compte) >= 0
              ? "solde-positive"
              : "solde-negative")
          }
        >
          <p className="soldeaccount">
            {userAccount.solde_compte !== "" &&
              parseFloat(userAccount.solde_compte).toLocaleString("fr-FR", {
                style: "currency",
                currency: userAccount.devise,
              })}
          </p>
        </div>

        <div className="container-calendar">
          <Calendar
            views={""}
            view="week"
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

        <div className="container-buttons">
          <a href="/account">
            <button className="buttonbleu">Accédez à vos comptes</button>
          </a>
          <a href="/budget">
            <button className="buttonbleu">Accédez à vos budgets</button>
          </a>
        </div>
        <div className="container-doughnut">
          <div className="doughnut">
            <Doughnut />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
