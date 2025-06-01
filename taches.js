// Gestionnaire de tâches simple en JavaScript
let taches = []; // tableau pour stocker les tâches
let defautfiltre = 'tout'; // filtre par défaut

// getionnaires d'evénements
document.getElementById('tacheForm').addEventListener('submit', function(e) {
    e.preventDefault(); // empêche le rechargement de la page
    ajouterTache();
});
document.getElementById('btnRecherche').addEventListener('click', rechercheTache);
document.getElementById('toutButton').addEventListener('click', () => filtrerTaches('tout'));
document.getElementById('faireButton').addEventListener('click', () => filtrerTaches('faire'));
document.getElementById('faitButton').addEventListener('click', () => filtrerTaches('fait'));
//Ajout d'une tâche
function ajouterTache() {
    const titre = document.getElementById('titre').value.trim();
    const categorie = document.getElementById('categorie').value;
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value;
    const heure = document.getElementById('heure').value;

    if (titre && categorie && date && heure) {
        const tache = {
            id: Date.now(), // utilise le timestamp comme identifiant unique
            titre,
            categorie,
            description,
            date,
            heure,
            terminee: false
        };
        taches.push(tache);
        afficherTaches(defautfiltre);
        reinitialiserChamps();
        compteurTaches();
    }
}

// Afficher les tâches selon le filtre selectionné
function afficherTaches(filtre = 'tout') {
    defautfiltre = filtre; // met à jour le filtre par défaut
    const listeTaches = document.getElementById('listeTaches');
    listeTaches.innerHTML = ''; // vide la liste avant de l'afficher
    taches.forEach(tache => {
        if (filtre === 'tout' || (filtre === 'faire' && !tache.terminee) || (filtre === 'fait' && tache.terminee)) {
            const row = document.createElement('tr');
            row.className = tache.terminee ? 'fait' : '';
            row.innerHTML = `
                <td><input type="checkbox" ${tache.terminee ? 'checked' : ''} onclick="terminerTache(${tache.id}, this)"></td>
                <td>${tache.titre}</td>
                <td>${tache.categorie}</td>
                <td>${tache.description}</td>
                <td>${tache.date}</td>
                <td>${tache.heure}</td>
                <td>
                    <button onclick="modifierTache(${tache.id})">Modifier</button>
                    <button onclick="supprimerTache(${tache.id})">Supprimer</button>
                </td>
            `;
            listeTaches.appendChild(row);
        }
    });
}
// basculer l'état  de complétion d'une tâche
function terminerTache(id, checkbox) {
    const index = taches.findIndex(t => t.id === id);
    if (index !== -1) {
        taches[index].terminee = checkbox.checked;
        afficherTaches(defautfiltre);
        compteurTaches();
    }
}
// Supprimer une tâche
function supprimerTache(id) {
    const index = taches.findIndex(t => t.id === id);
    if (index !== -1){
        taches.splice(index, 1); // supprime la tâche du tableau
        afficherTaches(defautfiltre);
        compteurTaches();
    }
}
// Modifier une tâche en pré-remplissant le formulaire et en supprimant pour réinsertion
function modifierTache(id) {
    const index = taches.findIndex(t => t.id === id);
    if (index !== -1) {
        const tache = taches[index];
        document.getElementById('titre').value = tache.titre;
        document.getElementById('categorie').value = tache.categorie;
        document.getElementById('description').value = tache.description;
        document.getElementById('date').value = tache.date;
        document.getElementById('heure').value = tache.heure;
        supprimerTache(id); // supprime la tâche pour réinsertion
    }
}
// Réinitialiser les champs du formulaire
function reinitialiserChamps() {
    document.getElementById('titre').value = '';
    document.getElementById('categorie').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('heure').value = '';
}
// Applique le filtre et met à jour le bouton actif
function filtrerTaches(filtre) {
    updateActiveButton(filtre);
    afficherTaches(filtre);
}

function updateActiveButton(filtre) {
    const buttons = document.querySelectorAll('.filtre button');
    buttons.forEach(button => button.classList.remove('active'));
    const boutonactif = document.getElementById(filtre + 'Button');
    if (boutonactif) boutonactif.classList.add('active');
}

// Recherche des tâches contenant le terme saisi
function rechercheTache() {
    const recherche = document.getElementById('espace-recherche').value.trim().toLowerCase();
    const filtrerTaches = taches.filter(tache =>
        tache.titre.toLowerCase().includes(recherche) ||
        tache.categorie.toLowerCase().includes(recherche) ||
        tache.description.toLowerCase().includes(recherche)
    );
    const listeTaches = document.getElementById('listeTaches');
    listeTaches.innerHTML = ''; // vide la liste avant de l'afficher
    filtrerTaches.forEach(tache => {
        const row = document.createElement('tr');
        row.className = tache.terminee ? 'fait' : '';
        row.innerHTML = `
            <td><input type="checkbox" ${tache.terminee ? 'checked' : ''} onclick="terminerTache(${tache.id}, this)"></td>
            <td>${tache.titre}</td>
            <td>${tache.categorie}</td>
            <td>${tache.description}</td>
            <td>${tache.date}</td>
            <td>${tache.heure}</td>
            
            <td>
                <button onclick="modifierTache(${tache.id})">Modifier</button>
                <button onclick="supprimerTache(${tache.id})">Supprimer</button>
            </td>
        `;
        listeTaches.appendChild(row);
    });
}
//met à jour le compteur de tâches affichées dans les boutons de filtre
function compteurTaches() {
      document.getElementById('comptetout').innerText = taches.length;
      document.getElementById('comptefaire').innerText = taches.filter(t => !t.terminee).length;
      document.getElementById('comptefait').innerText = taches.filter(t => t.terminee).length;
}