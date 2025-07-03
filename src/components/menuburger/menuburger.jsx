import { useState, useEffect } from 'react';
import Style from './menuburger.scss';

export default function MenuBurger(){
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    return(
        <>
            <div id="menuburger" className={`menuburger ${isOpen ? 'active' : ''}`}>
                <a id="closeBtn" href="#" className="close" onClick={(e) => {
                    e.preventDefault();
                    toggleMenu();
                }}>×</a>
                <ul>
                    <li><a href="/dashboard">Tableau de bord</a></li>
                    <li><a href="/account">Compte de gestion</a></li>
                    <li><a href="/budget">Budget</a></li>
                    <li><a href="/profile">Profil/Paramètres</a></li>
                </ul>
            </div>
            
            <a href="#" id="openBtn" onClick={(e) => {
                e.preventDefault();
                toggleMenu();
            }}>
                <span className="burger-icon">
                    <span></span> 
                    <span></span>
                    <span></span>
                </span>
            </a>
        </>
    );
}