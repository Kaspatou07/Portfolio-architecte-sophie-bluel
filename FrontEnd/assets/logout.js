
// Attend que le contenu du document HTML soit chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function () {
    
  // Récupère l'élément avec l'identifiant "loginLogoutContainer" du HTML
  const loginLogoutContainer = document.getElementById("loginLogoutContainer");

  const token = localStorage.getItem("token");

  if (token) {
      // Si un jeton existe, crée le lien de déconnexion (logout)
      const logoutLink = document.createElement("span");
      // Définit l'ID de l'élément <span> créé pour la déconnexion
      logoutLink.id = "logoutLink";
      // Définit le contenu HTML de l'élément <span> pour inclure un lien de déconnexion et avec le texte "logout"
      logoutLink.innerHTML = '<a href="#" id="logoutBtn">logout</a>';
      // Ajoute l'élément <span> avec le lien de déconnexion à l'élément conteneur spécifié dans le HTML
      loginLogoutContainer.appendChild(logoutLink);

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
          logoutBtn.addEventListener("click", logout);
      }
  } else {
      // Si aucun jeton, crée le lien de connexion
      const loginLink = document.createElement("span");
      // Définit l'ID de l'élément <span> créé pour se connecter
      loginLink.id = "loginLink";
      // Définit le contenu HTML de l'élément <span> pour inclure un lien de la page de connexion et le texte "login"
      loginLink.innerHTML = '<a href="./login.html">login</a>';
      // Ajoute l'élément <span> avec le lien de connexion à l'élément conteneur spécifié dans le HTML
      loginLogoutContainer.appendChild(loginLink);
  }
});

// Fonction de déconnexion
function logout() {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
}
