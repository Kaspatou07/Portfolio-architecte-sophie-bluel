// Sélectionne le formulaire, le champ d'email et le champ de mot de passe du DOM
const loginForm = document.querySelector('.formlogin');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');


// Ajoute un écouteur d'événements pour le formulaire lors de la soumission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Récupère la valeur de l'email et du mot de passe saisis par l'utilisateur
    const email = emailInput.value;
    const password = passwordInput.value;

    // Obtient le token d'accès du stockage local, s'il existe
    const token = localStorage.getItem('token');
    
    // Envoie une requête POST à l'API avec les informations d'authentification
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // La requête en format JSON
            
        },
        body: JSON.stringify({
            email: email, 
            password: password 
        })
    })
    .then(response => {
        if (response.ok) {
            // Si statut HTTP 200, l'utilisateur est authentifié
            return response.json(); // Renvoie les données JSON de la réponse
        } else {
            throw new Error('Les informations d\'utilisateur / mot de passe ne sont pas correctes. Veuillez réessayer.');
        }
    })

    
    .then(data => {
        if (data.token) {
            // Stocke le token dans le stockage local du navigateur
            localStorage.setItem('token', data.token);
            window.location.href = './index.html';
            updateBanner();
            
        } else {
            throw new Error('Token d\'authentification manquant dans la réponse de l\'API.');
        }
    })
    .catch(error => {
        // En cas d'erreur lors de la requête, affiche le message d'erreur dans le formulaire
        const errorMessage = document.createElement('p');
        errorMessage.textContent = error.message;
        errorMessage.style.color = 'red';
        loginForm.appendChild(errorMessage);
    });
});


