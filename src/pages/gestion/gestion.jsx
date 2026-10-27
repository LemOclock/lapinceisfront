import "./gestion.scss";
import "../../global.scss";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import { Calendar, momentLocalizer, Navigate } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { GestionDepense, GestionRevenu } from "../../components/gestionoperation/gestionoperation";
import { getOperationByDate, getOperationsByMonth, findCompteId } from "../../api/gestion";
import GestionModifyDeleteOperation from "../../components/gestionmodifydeleteoperation/gestionmodifydeleteoperation";


const localizer = momentLocalizer(moment);

// Date "AAAA-MM-JJ" -> Date locale (évite le décalage UTC de new Date("AAAA-MM-JJ"))
const parseLocalDate = (value) => {
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Fonction pour mettre en surbrillance le jour actuel
const dayPropGetter = (date) => {
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return {
      style: { backgroundColor: "#ede5de" },
    };
  }
  return {};
};

export default function Gestion() {
  const [dateFR, setDateFR] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [popupInfo, setPopupInfo] = useState(null);
  const [showAddExpenseModalDepense, setShowAddExpenseModalDepense] = useState(false);
  const [showAddExpenseModalRevenu, setShowAddExpenseModalRevenu] = useState(false)
  const [showModifyDeleteModal, setShowModifyDeleteModal] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [operationByDate, setOperationByDate] = useState([]);
  const [monthlyOperations, setMonthlyOperations] = useState([]);
  const [nomCompte, setNomCompte] = useState("");

  useEffect(() => {
    findCompteId()
      .then((response) => setNomCompte(response.data.nom_compte))
      .catch((error) => console.error("Erreur compte :", error));
  }, []);

  const loadMonthlyOperations = async () => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    try {
      const operations = await getOperationsByMonth(month, year);

      const operationEvents = operations.data.map(operation => ({
        id: operation.id,
        date: parseLocalDate(operation.date_operation),
        icone: operation.Categorie?.icone || '💰',
        nom: operation.nom_operation,
        montant: operation.montant_operation
      }));

      setMonthlyOperations(operationEvents);

    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  useEffect(() => {
    loadMonthlyOperations();
  }, [currentDate]);
  // Se lance à chaque fois que currentDate change


  // Toolbar pour le calendrier (Précédent, Suivant, Aujourd'hui)
  const CustomToolbar = ({ onNavigate, label }) => {
    const goToCurrent = () => onNavigate(Navigate.TODAY);
    const goToNext = () => onNavigate(Navigate.NEXT);
    const goToPrev = () => onNavigate(Navigate.PREVIOUS);

    return (
      <div className="rbc-toolbar">
        <button className="calendar-arrow" onClick={goToPrev} aria-label="Semaine précédente">
                &#8592;
            </button>
        <span>{label}</span>
        <button className="calendar-arrow" onClick={goToNext} aria-label="Semaine suivante">
                &#8594;
            </button>
        <button onClick={goToCurrent}>Aujourd'hui</button>

        
      
            
      </div>
    );
  };
  
  function isSameMonth(date1, date2) {
  return moment(date1).isSame(moment(date2), 'month');
}

  const CustomDateCellWrapper = ({ children, value }) => {
    // Filtrer les opérations pour cette date spécifique SEULEMENT
    const dayOperations = monthlyOperations.filter(operation => {
      // operation.date est déjà un objet Date, pas besoin de new Date()
      return operation.date.toDateString() === value.toDateString();
    });
    
    // Vérifier si la date est en dehors de la plage sélectionnée
    const isOffRange = !isSameMonth(currentDate, value);
    const isToday = new Date().toDateString() === value.toDateString();
  
  // Classes combinées
  const cellClasses = `custom-date-cell-wrapper 
    ${isOffRange ? 'is-off-month' : ''} 
    ${isToday ? 'is-today' : ''}`;



    const handleClick = () => {
      const slotInfo = { start: value }
      getOperationBy(slotInfo); // Appel de la fonction pour récupérer les opérations de cette date
    }





    return (
      <div className={cellClasses} onTouchStart={handleClick} onClick={handleClick}>
      
        {/* Afficher SEULEMENT les opérations de cette date */}
        {dayOperations.length > 0 && (
          <div className="operation-icons">
            {dayOperations.slice(0, 3).map((operation, index) => (
              <span key={index} className="operation-icon" title={operation.nom}>
                {operation.icone}
              </span>
            ))}
            {dayOperations.length > 3 && (
              <span className="more-operations">+{dayOperations.length - 3}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Fonction pour afficher le popup avec la date sélectionnée
  const popup = (slotInfo) => {
    setPopupInfo({
      date: slotInfo.start.toLocaleDateString("fr"),
      dateUS: slotInfo.start,
    });
  };

  // Fonction pour fermer le popup
  const closePopup = () => {
    setPopupInfo(null);
  };

  const getOperationBy = async (slotInfo) => {
    const date = slotInfo.start;
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    const dateFormat = new Intl.DateTimeFormat("fr-CA", options).format(date)

    try {
      const response = await getOperationByDate(dateFormat);

      setOperationByDate(response.data);

      setPopupInfo({
        date: slotInfo.start.toLocaleDateString("fr"), //  02/07/2024
        dateUS: dateFormat,
      });
    }

    catch (error) {
      console.error("Erreur lors de la récupération des opérations par date :", error);
    }
  }


  const modifyPopup = (operation) => {
    setShowModifyDeleteModal(true)
    setSelectedOperation(operation)

  }
  const closeModifyPopup = () => {
    setShowModifyDeleteModal(false)
    setSelectedOperation(null)

  }


  return (
    <>
      <Navbar />
      <main>
        <div className="nomcompteconteneur">
          <h1 className="nomcompte">{nomCompte}</h1>
        </div>
          <p className="description-calendar">Cliquer sur une date pour voir, ajouter ou modifier une opération.</p>
        <div className="calendrier">
          <Calendar
            selectable={true}
            views={["month"]}
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            dayPropGetter={dayPropGetter}
            components={{
              toolbar: CustomToolbar,
              dateCellWrapper: CustomDateCellWrapper
            }}
            onSelectSlot={getOperationBy}

            style={{
              height: "70vh",
              width: "100%",
            }}
          />


        </div>
        <div className="boutonbudgetconteneur">
          <a href="/budget">
          <button className="buttonbleu boutonbudget">
            ACCEDER A VOS BUDGETS
          </button>
          </a>
        </div>

        {popupInfo && (
          <div className="popup-overlay">
            <div className="popup">
              <button className="closepopup" onClick={closePopup}>
                ×
              </button>
              <div className="popup-header">
                <h3>{popupInfo.date}</h3>
              </div>

              <div className="popup-content">
                <h4>Opération :</h4>
                <table className="tableauoperation">
                  <thead>
                    <tr>
                      <th>Libellé</th>
                      <th>Montant</th>
                      <th>Catégorie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operationByDate.map((operation) => (
                      <tr
                        key={operation.id}
                        onClick={() => { modifyPopup(operation) }}
                      >
                        <td>{operation.nom_operation}</td>
                        <td>{parseFloat(operation.montant_operation).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</td>
                        <td> {operation.Categorie?.icone} {operation.Categorie?.nom_categorie}</td>
                      </tr>
                    ))}
                    {operationByDate.length === 0 && (
                      <tr>
                        <td colSpan="3">Aucune opération ce jour-là</td>
                      </tr>
                    )}
                  </tbody>
                </table>



                <div className="popup-buttons">
                  <button
                    className="buttonbleu ajoutdepense"
                    onClick={() => {
                      setSelectedDate(popupInfo.dateUS);
                      setDateFR(popupInfo.date);
                      closePopup();
                      setShowAddExpenseModalDepense(true);

                    }}
                  >
                    Ajouter une dépense
                  </button>


                  <button
                    className="buttonbleu ajoutrevenu"
                    onClick={() => {
                      setSelectedDate(popupInfo.dateUS);
                      setDateFR(popupInfo.date);
                      closePopup();
                      setShowAddExpenseModalRevenu(true);

                    }}
                  >
                    Ajouter un revenu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModifyDeleteModal && (
          <GestionModifyDeleteOperation
            operation={selectedOperation}
            onClose={closeModifyPopup}
            dateFR={popupInfo ? popupInfo.date : dateFR}
            onModify={() => {
              loadMonthlyOperations()
            }}

          />
        )

        }

        {showAddExpenseModalDepense && (
          <GestionDepense
            selectedDate={popupInfo ? popupInfo.dateUS : selectedDate}
            onClose={() => setShowAddExpenseModalDepense(false)}
            onExpenseAdded={() => {
              loadMonthlyOperations();
            }}
            dateFR={popupInfo ? popupInfo.date : dateFR}

          />
        )}

        {showAddExpenseModalRevenu && (
          <GestionRevenu
            selectedDate={popupInfo ? popupInfo.dateUS : selectedDate}
            onClose={() => setShowAddExpenseModalRevenu(false)}
            onExpenseAdded={() => {
              loadMonthlyOperations();
            }}
            dateFR={popupInfo ? popupInfo.date : dateFR}

          />
        )}



        
      </main >
      <Footer />
    </>
  );
}
