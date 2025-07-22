import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tokenexpiration.scss';


function TokenExpirationHandler() {
    const navigate = useNavigate();
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        // Fonction pour vérifier et configurer l'expiration
        const setupTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                // Décoder le JWT pour obtenir l'expiration
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiresAt = payload.exp * 1000; // Convertir en millisecondes
                const timeUntilExpiry = expiresAt - Date.now();

                // Si déjà expiré, supprimer tout de suite
                if (timeUntilExpiry <= 0) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                // Timer pour afficher le message d'avertissement 5 secondes avant expiration
                const warningTimer = setTimeout(() => {
                    setShowWarning(true);
                }, timeUntilExpiry - 10000); // 5 secondes avant l'expiration

                // Timer principal pour la déconnexion
                const expiryTimer = setTimeout(() => {
                     setShowWarning(false);
                    localStorage.removeItem('token');
                    navigate('/login');
                }, timeUntilExpiry);

                // Nettoyer les timers si le composant est démonté
                return () => {
                    clearTimeout(warningTimer);
                    clearTimeout(expiryTimer);
                };
            } catch (error) {
                console.error('Erreur de vérification du token:', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        // Exécuter au montage du composant
        return setupTokenExpiration();
    }, [navigate]);


    return (
        <>
            {showWarning && (
                <div className="token-warning-overlay">
                    <div className="token-warning-popup">
                        <p>Votre session va expirer</p>
                        <p>Vous serez déconnecté dans 10 secondes.</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default TokenExpirationHandler;