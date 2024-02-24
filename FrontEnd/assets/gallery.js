// Sélection de la div où afficher les projets
const projetGallery = document.getElementById("Gallery");
// Sélection de la div où afficher les filtres
const filterCategorie = document.getElementById("Filters");
// Adresse de l'API
const apiUrl = "http://localhost:5678/api/";


const token = localStorage.getItem("token");

// Fonction pour supprimer la div des filtres
function removeFiltersContainer() {
    filterCategorie.innerHTML = "";
}




// Fonction qui gère l'affichage de la galerie
async function loadGallery() {
    try {
        const response = await fetch(apiUrl + 'works');

        if (!response.ok) {
            throw new Error('Erreur réseau ou serveur avec le statut : ' + response.status);
        }

        const data = await response.json();

        data.forEach(work => {
            const figure = document.createElement("figure");
            figure.dataset.categoryId = work.categoryId;
            figure.dataset.projectId = work.id;
            // Affichage de l'image
            const image = document.createElement("img");
            image.src = work.imageUrl;
            figure.appendChild(image);
            // Affichage du titre
            const title = document.createElement("figcaption");
            title.textContent = work.title;
            figure.appendChild(title);
            // Ajoute la figure au conteneur
            projetGallery.appendChild(figure);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

loadGallery();



// Créer un objet Set pour stocker les catégories sélectionnées
const selectedCategories = new Set();

// Fonction asynchrone pour gérer l'affichage des filtres
async function loadFilters() {
    try {
        const response = await fetch(apiUrl + 'categories');

        if (!response.ok) {
            throw new Error('Erreur réseau ou serveur avec le statut : ' + response.status);
        }

        const categories = await response.json();

        if (token) {
            removeFiltersContainer();
        } else {
            // Création d'une div pour les filtres
            const filtersContainer = document.createElement("div");
            // Ajoute un filtre "Tous" et le rendre actif par défaut
            const showAllFilter = document.createElement("div");
            showAllFilter.textContent = "Tous";
            showAllFilter.className = "filter active";

            // Ajoute l'écouteur d'événement pour le clic sur 'Tous'
            showAllFilter.addEventListener("click", () => {
                // Active le filtre "Tous" et désactiver les autres filtres
                showAllFilter.classList.add("active");
                const filters = document.querySelectorAll(".filter");
                filters.forEach(filter => {
                    if (filter !== showAllFilter) {
                        filter.classList.remove("active");
                    }
                });

                selectedCategories.clear(); // Réinitialise les catégories sélectionnées

                // Affiche toutes les images
                const figures = document.querySelectorAll("#Gallery figure");
                figures.forEach(figure => {
                    figure.style.display = "block";
                });
            });
            filtersContainer.appendChild(showAllFilter);


        // Parcourir les catégories et afficher les filtres
        categories.forEach(categorie => {
            const filter = document.createElement("div");
            filter.textContent = categorie.name; 
            filter.className = "filter"; 

            // Ajoute un écouteur d'événements pour le clic sur chaque filtre
            filter.addEventListener("click", () => {
                const categoryId = categorie.id; 

                // Vérifie si la catégorie est déjà sélectionnée ou non
                if (selectedCategories.has(categoryId)) {
                    // Si la catégorie est déjà sélectionnée, la retire de l'ensemble
                    selectedCategories.delete(categoryId);
                    filter.classList.remove("active"); // Retire la classe 'active' au filtre
                } else {
                    // Sinon, ajouter la catégorie à l'ensemble
                    selectedCategories.add(categoryId);
                    filter.classList.add("active"); 
                    showAllFilter.classList.remove("active"); // Désactive le filtre "Tous"
                }

                // Vérifie si aucune catégorie n'est sélectionnée
                if (selectedCategories.size === 0) {
                    // Active le filtre "Tous"
                    showAllFilter.classList.add("active");
                }

                // Filtre les images en fonction des catégories sélectionnées
                const figures = document.querySelectorAll("#Gallery figure");
                figures.forEach(figure => {
                    const figureCategoryId = parseInt(figure.dataset.categoryId);
                    // Vérifie si la figure appartient à l'une des catégories sélectionnées
                    if (selectedCategories.size === 0 || selectedCategories.has(figureCategoryId)) {
                        figure.style.display = "block"; // Affiche la figure
                    } else {
                        figure.style.display = "none"; // Masque la figure
                    }
                });
            });
            filtersContainer.appendChild(filter);
        });
        filterCategorie.appendChild(filtersContainer);
    }
} catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
}
}

loadFilters();

