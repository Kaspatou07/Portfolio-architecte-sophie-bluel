// Fonction pour vérifier si l'utilisateur est authentifié (possède un jeton)
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Mattre à jour la bannière
function updateBanner() {
    const Banner = document.getElementById('Banner');
    if (isAuthenticated()) {
        if (!Banner) {
            createBanner();
        }
    } else {
        if (Banner) {
            removeBanner();
        }
    }
}


function createBanner() { 
    const body = document.querySelector('body');
    // Crée un nouvel élément div avec l'ID "Banner"
    const Banner = document.createElement('div');
    Banner.id = 'Banner';
    // Ajoute la classe "banner" à l'élément
    Banner.classList.add('banner');
    // Définit le contenu HTML de la bannière avec une icône FontAwesome et du texte
    Banner.innerHTML = '<i class="fas fa-pen-to-square"></i>Mode édition';
    // Insère la bannière comme premier enfant du corps
    body.insertBefore(Banner, body.firstChild);
}

// Fonction pour supprimer la bannière
function removeBanner() {
    const Banner = document.getElementById('Banner');
    if (Banner) {
        Banner.remove();
    }
}

// Écouteur d'événements pour s'assurer que le script s'exécute après le chargement complet du DOM
document.addEventListener('DOMContentLoaded', function () {
    // Appelle la fonction updateBanner lors du chargement de la page
    updateBanner();
});
