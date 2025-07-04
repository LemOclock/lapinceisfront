import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import React from "react";
import { Bar } from "react-chartjs-2";
import Camembert from "../../components/camembert/camembert";
import ProgressBar from "../../components/progressbar/progressbar";
import Style from "./landing.scss";
import GlobalStyle from '../../global.scss';
export default function Landing() {


  return (
    <>
      <Navbar />
      <main>
        <p>
          Conçue pour être à la fois simple, intuitive et accessible à tous, <span className="lapince">La
            Pince</span> est là pour vous aider à gérer vos finances
        </p>
        <div className="camembert-container">
          <Camembert />
        </div>
        <p>
          {" "}
          <span className="lapince">La
            Pince</span>, c’est l’appli web qui rend la gestion de vos finances
          simple, claire et (presque) amusante !
        </p>
        <div className="button-container">
          <a className="buttonbleu buttonjoin" href="/login"> JOIN THE CRAB ARMY
          </a>
        </div>

        <p>
          {" "}
          Un outil simple et intuitif pour suivre ses dépenses, gérer ses
          revenus, et reprendre le contrôle de son budget. Visualisez où part
          votre argent, planifiez vos économies, et prenez des décisions
          financières en toute confiance.
        </p>
        <div className="calendar-container" >
          <img src="../../img/TableauGestion.png" alt="calendrier" />
        </div>
        <div className="progressbarfeatures-container">
          <div className="progressbar-container">
            <ProgressBar />
          </div>
          <p>
            Un système de budget personnalisé pour fixer des limites de dépenses par catégorie et garder le contrôle à tout moment. Recevez des alertes en temps réel dès qu’un seuil est atteint ou qu’un dépassement est imminent. Anticipez vos fins de mois, ajustez vos habitudes en un clic, et gérez votre argent en toute sérénité.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}





