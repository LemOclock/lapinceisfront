import "./gestion.scss";
import "../../global.scss";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/footer";
import { Calendar, momentLocalizer, Navigate } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { GestionDepense, GestionRevenu } from "../../components/gestionoperation/gestionoperation";
import { getOperationByDate, getOperationsByMonth } from "../../api/gestion";
import GestionModifyDeleteOperation from "../../components/gestionmodifydeleteoperation/gestionmodifydeleteoperation";


const localizer = momentLocalizer(moment);

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
        nom: operation.nom_operation,
        montant: operation.montant_operation
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
  // Se lance à chaque fois que currentDate change


  // Toolbar pour le calendrier (Précédent, Suivant, Aujourd'hui)
  const CustomToolbar = ({ onNavigate, label }) => {
    const goToCurrent = () => {
      const today = new Date();
      setCurrentDate(today);
      loadMonthlyOperations();
      onNavigate(Navigate.TODAY);
    };
    const goToNext = () => {
      onNavigate(Navigate.NEXT);
      loadMonthlyOperations();
    };
    const goToPrev = () => {
      onNavigate(Navigate.PREVIOUS);
      loadMonthlyOperations();
    };

    return (
      <div className="rbc-toolbar">
        <button onClick={goToPrev}>Préc</button>
        <span>{label}</span>
        <button onClick={goToNext}>Suiv</button>
        <button onClick={goToCurrent}>Aujourd'hui</button>
      </div>
    );
  };

  const CustomDateCellWrapper = ({ children, value }) => {
    // Filtrer les opérations pour cette date spécifique SEULEMENT
    const dayOperations = monthlyOperations.filter(operation => {
      // operation.date est déjà un objet Date, pas besoin de new Date()
      return operation.date.toDateString() === value.toDateString();
    });
    

    const handleClick = () => {
      const slotInfo = { start: value }
      getOperationBy(slotInfo); // Appel de la fonction pour récupérer les opérations de cette date
    }





    return (
      <div className="custom-date-cell-wrapper" onTouchStart={handleClick} onClick={handleClick}>
      
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
      console.log("test");
      const response = await getOperationByDate(dateFormat);
      console.log(response);

      setOperationByDate(response.data);
      console.log("Opérations récupérées par date :", response.data);

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
    console.log("Ouverture du popup de modification pour:", operation);
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
          <h1 className="nomcompte">Epargne</h1>
        </div>
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
                    {operationByDate.map((operation, index) => (
                      <tr
                        key={index}
                        onClick={() => { modifyPopup(operation) }}
                      >
                        <td>{operation.nom_operation}</td>
                        <td>{operation.montant_operation}</td>
                        <td> {operation.Categorie?.icone} {operation.Categorie?.nom_categorie}</td>
                      </tr>
                    ))}
                    {/* { operationByDate.map == "" && 

                    } */}
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
              console.log("Opération modifiée avec succès");
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
              console.log("Dépense ajoutée avec succès");
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
              console.log("Revenu ajoutée avec succès");
              loadMonthlyOperations();
            }}
            dateFR={popupInfo ? popupInfo.date : dateFR}

          />
        )}



        <div className="boutonbudgetconteneur">
          <button className="buttonbleu boutonbudget">
            ACCEDER A VOS BUDGETS
          </button>
        </div>
      </main >
      <Footer />
    </>
  );
}
