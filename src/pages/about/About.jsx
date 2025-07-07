import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer/footer";
import "./About.scss";

const About = ({ isLoggedIn = false }) => {
  return (
    <div className="about-page">
      {isLoggedIn ? (
        <Navbar />
      ) : (
        <button className="buttonbleu">Se connecter</button>
      )}

      <div className="about-container">
        <div className="logo">
          <img src="/images/logo.png" alt="La Pince" />
        </div>

        <div className="about-content">
          <h2>Une application pensée pour vous, pas pour les experts</h2>

          <p>
            La Pince, c'est l'histoire d'une idée simple : vous aider à mieux
            gérer votre argent, sans jargon, sans complications. Aujourd'hui,
            entre les dépenses imprévues, les abonnements qui s'accumulent et
            l'inflation, il devient difficile de garder un œil sur son budget.
            Et pourtant, savoir où part son argent, c'est essentiel pour
            reprendre le contrôle.
          </p>

          <h3>Pourquoi La Pince ?</h3>
          <p>
            Parce qu'on veut vous éviter les fins de mois difficiles. Parce
            qu'on croit qu'on peut tous apprendre à mieux gérer notre argent,
            même sans être un pro de la finance. La Pince a été conçue pour être
            simple, intuitive et accessible à tous – que vous soyez étudiant,
            jeune actif, parent ou indépendant.
          </p>

          <p>
            Notre promesse ? Un outil gratuit, clair, pédagogique, et sécurisé
            pour suivre vos dépenses, planifier vos économies et prendre de
            meilleures décisions.
          </p>

          <h3>Notre approche</h3>
          <p>
            Dans un monde rempli d'outils bancaires compliqués ou fermés, La
            Pince choisit la simplicité :
          </p>
          <ul>
            <li>Une interface claire, sans jargon.</li>
            <li>Une appli gratuite, vraiment.</li>
            <li>Un accompagnement pédagogique, pour progresser pas à pas.</li>
            <li>Une transparence totale, sur vos données et leur sécurité.</li>
          </ul>

          <p>
            Nous ne cherchons pas à en mettre plein la vue avec des
            fonctionnalités complexes : nous voulons simplement que vous
            compreniez où va votre argent et comment en faire bon usage. Gérer
            son budget, ça ne devrait pas être une prise de tête.
          </p>

          <h3>Notre équipe</h3>
          <p>
            Derrière La Pince, une équipe de passionnés convaincus qu'un
            meilleur rapport à l'argent commence par une bonne information, des
            outils accessibles, et une vraie volonté de changer les habitudes.
            On avance ensemble, avec vous, pour rendre la gestion financière
            plus humaine, plus simple, et plus efficace.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
