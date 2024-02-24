
const token = localStorage.getItem("token");

// Sélectionne la div et le dialog
const openButton = document.querySelector("[data-open-modal]");
const closeButton = document.querySelector("[data-close-modal]");
const modal = document.querySelector("[data-modal]");
const modalgallery = document.getElementById("Modalgallery");
const stoppropa = document.getElementById("Stoppropa");

// Vérifie si j'ai un token
if (token) {
    openButton.addEventListener("click", () => {
        modal.showModal();
    });
} else {
    if (openButton) {
        openButton.parentNode.removeChild(openButton);
    }
}

// Écouteur d'événements pour fermer la modal
closeButton.addEventListener("click", () => {
    modal.close();
});

// Écouteur d'événements pour fermer la modal lors du clic à l'extérieur
modal.addEventListener('click', () => modal.close());
// Ajout d'un écouteur d'évènements pour empêcher la propagations des cliques sur la div imbriqué dans la modal (afin que la modal ne se ferme pas si on clique dessus)
stoppropa.addEventListener('click', (event) => event.stopPropagation());


const apiUrl = "http://localhost:5678/api/";


// Fonction asynchrone qui gère l'affichage de la galerie dans la modal et l'icône pour supprimer les images
async function loadWorksInModal() {
    try {
        const response = await fetch(apiUrl + 'works');
        if (!response.ok) {
            throw new Error('Erreur réseau ou serveur avec le statut : ' + response.status);
        }

        

        const data = await response.json();

        // Parcourir les données et afficher l'image et le titre dans une div
        data.forEach(work => {
            const figure = document.createElement("figure");
            // Stock l'ID de la catégorie dans un attribut data
            // figure.dataset.categoryId = work.categoryId;
            figure.dataset.projectId = work.id;
            // Affichage de l'image
            const image = document.createElement("img");
            image.src = work.imageUrl;
            figure.appendChild(image);

            // Création de la poubelle
            const pouBelle = document.createElement("span");
            pouBelle.innerHTML = '<i class="fa-solid fa-trash-can fa-xs"></i>';
            pouBelle.addEventListener("click", () => {
                deleteProject(work.id); // Utilisation de l'ID du projet
            });
            // Ajout de la poubelle à la figure
            figure.appendChild(pouBelle);
            // Ajoute la figure au conteneur
            modalgallery.appendChild(figure);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// Appel de la fonction pour charger les œuvres dans la modale
loadWorksInModal();



    // Fonction pour supprimer un projet
function deleteProject(projectId) {
    fetch(apiUrl + 'works/' + projectId, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            // Si la suppression est réussie, supprimer les éléments correspondants du DOM
            document.querySelectorAll(`figure[data-project-id="${projectId}"]`).forEach(element => {
                element.remove();
                modal.close();
            });
        } else {
            console.error('Erreur lors de la suppression du projet.');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la communication avec l\'API:', error);
    });
}


// Modal pour upload

// Selectionne les elements pour la modal upload dans le DOM
const uploadOpenButton = document.querySelector("[data-open-upload-modal]");
const uploadCloseButton = document.querySelector("[data-close-upload-modal]");
const uploadModal = document.querySelector("[data-upload-modal]");
const uploadForm = document.getElementById("uploadForm");
const stoppropaupload = document.getElementById("Stoppropa-upload");


// Écouteur d'événements pour ouvrir uploadmodal
uploadOpenButton.addEventListener("click", () => {
    uploadModal.showModal();
    resetUploadForm(); // Réinitialiser le formulaire lors de l'ouverture
    // Réaffiche le label, le bouton et la balise <i>
    const labelAddModal = document.querySelector(".btn-add-modal");
    if (labelAddModal) {
        labelAddModal.style.display = "block";
    }

    const iconAddModal = document.querySelector(".fa-regular.fa-image");
    if (iconAddModal) {
        iconAddModal.style.display = "block";
    }

    const paragraphAddModal = document.querySelector(".div-add-modal p");
    if (paragraphAddModal) {
        paragraphAddModal.style.display = "block";
    }
});

// Écouteur d'événements pour fermer uploadmodal avec la croix
uploadCloseButton.addEventListener("click", () => {
    modal.close();
    uploadModal.close();

});
// Écouteur d'événements pour fermer la uploadmodal lors du clic à l'extérieur
uploadModal.addEventListener('click', () => {
    modal.close();
    uploadModal.close();
});
// Ajout d'un écouteur d'évènements pour empêcher la propagations des cliques sur la div imbriqué dans la modal (afin que la modal ne se ferme pas si on clique dessus)
stoppropaupload.addEventListener('click', (event) => event.stopPropagation());

// Écouteur d'événements pour la fermeture de la modal
uploadModal.addEventListener("close", () => {
    resetUploadForm();
});

// Écouteur pour le clic sur la flèche pour revenir à la modal
const backtoThemodalButton = document.getElementById("backtoThemodal");
backtoThemodalButton.addEventListener("click", () => {
    uploadModal.close(); 
});



// Selection de la liste dans le DOM
const categorySelect = document.getElementById("projectCategory");
// Ajout d'une option vide par défaut
const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "Sélectionner une catégorie"; // Texte à afficher
categorySelect.appendChild(defaultOption);


// Menu déroulant de uploadmodal
async function optionCategories() {
    try {
        const response = await fetch(apiUrl + 'categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        data.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

optionCategories();


// Récupération de l'élément d'entrée de fichier et de l'élément d'aperçu
const projectImageInput = document.getElementById("projectImage");
const previewImage = document.getElementById("previewImage");

// Écouteur d'événements pour le changement dans l'élément d'entrée de fichier
projectImageInput.addEventListener("change", () => {
// Récupération du fichier sélectionné
const selectedFile = projectImageInput.files[0];

// Vérification de la taille du fichier
const maxSizeInBytes = 4 * 1024 * 1024; // 4 Mo
if (selectedFile && selectedFile.size > maxSizeInBytes) {
    alert("La taille de l'image ne doit pas dépasser 4 Mo.");
    return; // Arrêter le processus si la taille est trop grande
}

// Utilisation de FileReader pour lire le contenu du fichier
const reader = new FileReader();

reader.onload = function(e) {
    // Mise à jour de l'aperçu de l'image
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
    
    // Cacher le label, le bouton et la balise <i>
    const labelAddModal = document.querySelector(".btn-add-modal");
    if (labelAddModal) {
        labelAddModal.style.display = "none";
    }

    const iconAddModal = document.querySelector(".fa-regular.fa-image");
    if (iconAddModal) {
        iconAddModal.style.display = "none";
    }

    const paragraphAddModal = document.querySelector(".div-add-modal p");
    if (paragraphAddModal) {
        paragraphAddModal.style.display = "none";
    }
};

if (selectedFile) {
    // Lecture du contenu du fichier en tant que URL de données (data URL)
    reader.readAsDataURL(selectedFile);
} else {
    previewImage.src = "";
    previewImage.style.display = "none";
}
});

// Vérification des champs du formulaire
const projectTitleInput = document.getElementById("projectTitle");
const projectCategorySelect = document.getElementById("projectCategory");
// Sélection du bouton de soumission
const submitButton = document.querySelector("#uploadForm button");


// Écouteur d'événements pour les champs du formulaire
projectTitleInput.addEventListener("input", updateSubmitButtonColor);
projectCategorySelect.addEventListener("input", updateSubmitButtonColor);
projectImageInput.addEventListener("change", updateSubmitButtonColor);

// Fonction pour mettre à jour la couleur du bouton en fonction de la validité du formulaire
function updateSubmitButtonColor() {
    // Vérifiez si tous les champs du formulaire sont remplis
    const isFormValid = projectTitleInput.value.trim() !== "" &&
                        projectCategorySelect.value !== "" &&
                        projectImageInput.files.length > 0;

    // Mettez à jour la couleur du bouton en fonction de la validité du formulaire
    submitButton.style.backgroundColor = isFormValid ? "#1D6154" : "gray";
}



uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", projectImageInput.files[0]);
    formData.append("title", document.getElementById("projectTitle").value);
    formData.append("category", document.getElementById("projectCategory").value);

    try {
        const response = await fetch(apiUrl + 'works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        });

        if (!response.ok) {
            throw new Error('Error uploading project.');
        }
        const newProject = await response.json();
        
        createProjectModal(newProject);
        createProjectGallery(newProject);
        resetUploadForm();
        modal.close();
        uploadModal.close();
    } catch (error) {
        console.error('Error communicating with the API:', error);
    }
});

// Fonction pour réinitialiser les valeurs du formulaire
function resetUploadForm() {
    // Réinitialiser les valeurs du formulaire
    uploadForm.reset();
    previewImage.src = "";
    previewImage.style.display = "none";

}

function createProjectGallery (work) {
    const projetGallery = document.getElementById("Gallery");
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
}


function createProjectModal (work) {
    const modalgallery = document.getElementById("Modalgallery");
    const figure = document.createElement("figure");
        figure.dataset.categoryId = work.categoryId;
        figure.dataset.projectId = work.id;
        // Affichage de l'image
        const image = document.createElement("img");
        image.src = work.imageUrl;
        figure.appendChild(image);
        // Création de la poubelle
        const pouBelle = document.createElement("span");
        pouBelle.innerHTML = '<i class="fa-solid fa-trash-can fa-xs"></i>';
        pouBelle.addEventListener("click", () => {
            deleteProject(work.id); // Utilisation de l'ID du projet
        });
        // Ajout de la poubelle à la figure
        figure.appendChild(pouBelle);
        // Ajoute la figure au conteneur
        modalgallery.appendChild(figure);
}
