import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/Footer/footer";
import "./TermsConditions.scss";

const TermsConditions = ({ isLoggedIn = false }) => {
  return (
    <div className="terms-page">
      {isLoggedIn ? (
        <Navbar />
      ) : (
        <button className="buttonbleu">Se connecter</button>
      )}

      <div className="terms-container">
        <div className="logo">
          <img src="/images/logo.png" alt="La Pince" />
        </div>

        <div className="terms-content">
          <h2>Conditions Générales d'Utilisation (CGU)</h2>

          <h3>1. Présentation du site</h3>
          <p>
            En vertu de l'article 6 de la loi n°2004-575 du 21 juin 2004 pour la
            confiance dans l'économie numérique, il est précisé aux utilisateurs
            du site Lapince.com l'identité des différents intervenants dans le
            cadre de sa réalisation et de son suivi :
          </p>
          <p>
            <strong>Propriétaire :</strong> LaPince SARL - [Adresse] -
            contact@lapince.com
          </p>
          <p>
            <strong>Créateur :</strong> LaPince SARL - dev@lapince.com
          </p>
          <p>
            <strong>Responsable publication :</strong> [Nom - Prénom] -
            [Adresse] - [Téléphone]
          </p>

          <h3>
            2. Conditions générales d'utilisation du site et des services
            proposés
          </h3>
          <p>
            L'utilisation du site Lapince.com implique l'acceptation pleine et
            entière des conditions générales d'utilisation ci-après décrites.
            Ces conditions d'utilisation sont susceptibles d'être modifiées ou
            complétées à tout moment.
          </p>

          <h3>3. Description des services fournis</h3>
          <p>
            Le site Lapince.com a pour objet de fournir une information
            concernant l'ensemble des activités de LaPince SARL. Le propriétaire
            du site s'efforce de fournir sur le site Lapince.com des
            informations aussi précises que possible. Toutefois, il ne pourra
            être tenu responsable des omissions, des inexactitudes et des
            carences dans la mise à jour, qu'elles soient de son fait ou du fait
            des tiers partenaires qui lui fournissent ces informations.
          </p>

          <h3>4. Propriété intellectuelle</h3>
          <p>
            Le propriétaire du site est propriétaire exclusif de tous les
            éléments : textes, images, graphismes, logo, etc') inclus dans
            l'ensemble du site, sauf mentions contraires. Toute reproduction,
            représentation, modification, publication, adaptation de tout ou
            partie des éléments du site, quel que soit le moyen ou le procédé
            utilisé, est interdite, sauf autorisation écrite préalable.
          </p>

          <h3>5. Limitations de responsabilité</h3>
          <p>
            Le propriétaire du site ne pourra être tenu responsable des dommages
            directs et indirects causés au matériel de l'utilisateur, lors de
            l'accès au site, et résultant soit de l'utilisation d'un matériel ne
            répondant pas aux spécifications, soit de l'apparition d'un bug ou
            d'une incompatibilité.
          </p>

          <h3>6. Gestion des données personnelles</h3>
          <p>
            En France, les données personnelles sont notamment protégées par la
            loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004,
            l'article L. 226-13 du Code pénal et la Directive Européenne du 24
            octobre 1995.
          </p>

          <h3>7. Cookies</h3>
          <p>
            L'utilisateur est informé qu'lors de ses visites sur le site, un
            cookie peut s'installer automatiquement sur son logiciel de
            navigation. Les cookies ne permettent pas d'identifier l'utilisateur
            mais servent à enregistrer des informations relatives à la
            navigation de celui-ci sur le site.
          </p>

          <p>
            <strong>
              Tout litige en relation avec l'utilisation du site Lapince.com est
              soumis au droit français. En cas de litige, les tribunaux
              compétents seront ceux du ressort de [ville].
            </strong>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsConditions;
