// ================================================ GESTION DES TÂCHES ==========================================================

// Liste des tâches
let taches = [];
let defautFiltre = "tout";

// ================================================ AJOUT D'UNE TÂCHE ==========================================================
// Quand on ajoute une tâche avec le formulaire
document.getElementById("tacheForm").addEventListener("submit", function(e) {
    e.preventDefault();
    // On prend les valeurs des champs
    const titre = document.getElementById("titre").value.trim();
    const categorie = document.getElementById("categorie").value;
    const description = document.getElementById("description").value.trim();
    const date = document.getElementById("date").value;
    const heure = document.getElementById("heure").value;

    // On vérifie que tout est rempli sauf la description
    if (!titre || !categorie || !date || !heure) return;

    // On crée la tâche
    const tache = {
        id: Date.now(), // Utilise le timestamp comme ID unique
        titre,
        categorie,
        description,
        date,
        heure,
        terminee: false
    };
    taches.push(tache); // On ajoute à la liste
    afficherTaches(defautFiltre); // On affiche
    this.reset(); // On vide le formulaire
});

// ================================================ AFFICHAGE DES TÂCHES ==========================================================
// Fonction pour afficher les tâches (tableau ou cartes)
function afficherTaches(filtre = "tout") {
    const liste = document.getElementById("listeTaches");
    const cartes = document.getElementById("cartes-taches");
    liste.innerHTML = "";
    if (cartes) cartes.innerHTML = "";

    // On filtre selon le bouton choisi
    let tachesFiltrees = taches;
    if (filtre === "faire") tachesFiltrees = taches.filter(t => !t.terminee);
    if (filtre === "fait") tachesFiltrees = taches.filter(t => t.terminee);

    // Si écran large : tableau
    if (window.innerWidth > 900) {
        document.querySelector("table").style.display = "";
        if (cartes) cartes.style.display = "none";
        tachesFiltrees.forEach(tache => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><input type="checkbox" ${tache.terminee ? "checked" : ""} data-id="${tache.id}" class="checkbox-tache"></td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.titre}</td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.categorie}</td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.description}</td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.date}</td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.heure}</td>
                <td>
                    <button class="bouton-modifier" data-id="${tache.id}">Modifier</button>
                    <button class="bouton-supprimer" data-id="${tache.id}">Supprimer</button>
                </td>
            `;
            liste.appendChild(tr);
        });
    } else {
        // Sinon : cartes
        document.querySelector("table").style.display = "none";
        if (cartes) cartes.style.display = "flex";
        tachesFiltrees.forEach(tache => {
            const div = document.createElement("div");
            div.className = "carte-tache";
            div.innerHTML = `
                <label>
                    <input type="checkbox" ${tache.terminee ? "checked" : ""} data-id="${tache.id}" class="checkbox-tache">
                    <strong class="${tache.terminee ? "fait" : ""}">${tache.titre}</strong>
                </label>
                <span class="${tache.terminee ? "fait" : ""}">Catégorie : ${tache.categorie}</span>
                <span class="${tache.terminee ? "fait" : ""}">${tache.description}</span>
                <span class="${tache.terminee ? "fait" : ""}">Date : ${tache.date}</span>
                <span class="${tache.terminee ? "fait" : ""}">Heure : ${tache.heure}</span>
                <div class="actions">
                    <button class="bouton-modifier" data-id="${tache.id}">Modifier</button>
                    <button class="bouton-supprimer" data-id="${tache.id}">Supprimer</button>
                </div>
            `;
            cartes.appendChild(div);
        });
    }
    compteurTaches();
    ajouterListenersTaches();
}
// ================================================ TÂCHE DANS LISTE ==========================================================
// Ajoute les actions sur les boutons et cases à cocher
function ajouterListenersTaches() {
    // Quand on coche/décoche une tâche
    document.querySelectorAll('.checkbox-tache').forEach(cb => {
        cb.onclick = function() {
            const id = Number(this.getAttribute('data-id'));
            const tache = taches.find(t => t.id === id);
            if (tache) tache.terminee = this.checked;
            afficherTaches(defautFiltre);
        };
    });
    // Modifier une tâche
    document.querySelectorAll('.bouton-modifier').forEach(btn => {
        btn.onclick = function() {
            const id = Number(this.getAttribute('data-id'));
            modifierTache(id);
        };
    });
    // Supprimer une tâche
    document.querySelectorAll('.bouton-supprimer').forEach(btn => {
        btn.onclick = function() {
            const id = Number(this.getAttribute('data-id'));
            supprimerTache(id);
        };
    });
}

// Supprimer une tâche
function supprimerTache(id) {
    taches = taches.filter(t => t.id !== id);
    afficherTaches(defautFiltre);
}

// Modifier une tâche (remplit le formulaire avec les valeurs)
function modifierTache(id) {
    const tache = taches.find(t => t.id === id);
    if (!tache) return;
    document.getElementById("titre").value = tache.titre;
    document.getElementById("categorie").value = tache.categorie;
    document.getElementById("description").value = tache.description;
    document.getElementById("date").value = tache.date;
    document.getElementById("heure").value = tache.heure;
    // On supprime la tâche pour la remplacer à la validation
    taches = taches.filter(t => t.id !== id);
    afficherTaches(defautFiltre);
}

// Recherche de tâches
window.recherchetache = function() {
    const recherche = document.getElementById("espace-recherche").value.trim().toLowerCase();
    let tachesFiltrees = taches.filter(t =>
        t.titre.toLowerCase().includes(recherche) ||
        t.categorie.toLowerCase().includes(recherche) ||
        t.description.toLowerCase().includes(recherche)
    );
    afficherTachesFiltrees(tachesFiltrees);
};

// Affiche les tâches filtrées (recherche)
function afficherTachesFiltrees(tachesFiltrees) {
    const liste = document.getElementById("listeTaches");
    const cartes = document.getElementById("cartes-taches");
    liste.innerHTML = "";
    if (cartes) cartes.innerHTML = "";

    if (window.innerWidth > 900) {
        document.querySelector("table").style.display = "";
        if (cartes) cartes.style.display = "none";
        tachesFiltrees.forEach(tache => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><input type="checkbox" ${tache.terminee ? "checked" : ""} data-id="${tache.id}" class="checkbox-tache"></td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.titre}</td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.categorie}</td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.description}</td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.date}</td>
                <td class="${tache.terminee ? "fait" : ""}">${tache.heure}</td>
                <td>
                    <button class="bouton-modifier" data-id="${tache.id}">Modifier</button>
                    <button class="bouton-supprimer" data-id="${tache.id}">Supprimer</button>
                </td>
            `;
            liste.appendChild(tr);
        });
    } else {
        document.querySelector("table").style.display = "none";
        if (cartes) cartes.style.display = "flex";
        tachesFiltrees.forEach(tache => {
            const div = document.createElement("div");
            div.className = "carte-tache";
            div.innerHTML = `
                <label>
                    <input type="checkbox" ${tache.terminee ? "checked" : ""} data-id="${tache.id}" class="checkbox-tache">
                    <strong class="${tache.terminee ? "fait" : ""}">${tache.titre}</strong>
                </label>
                <span class="${tache.terminee ? "fait" : ""}">Catégorie : ${tache.categorie}</span>
                <span class="${tache.terminee ? "fait" : ""}">${tache.description}</span>
                <span class="${tache.terminee ? "fait" : ""}">Date : ${tache.date}</span>
                <span class="${tache.terminee ? "fait" : ""}">Heure : ${tache.heure}</span>
                <div class="actions">
                    <button class="bouton-modifier" data-id="${tache.id}">Modifier</button>
                    <button class="bouton-supprimer" data-id="${tache.id}">Supprimer</button>
                </div>
            `;
            cartes.appendChild(div);
        });
    }
    ajouterListenersTaches();
}

// Filtres (tous, à faire, terminées)
window.filtrerTaches = function(filtre) {
    defautFiltre = filtre;
    afficherTaches(filtre);
    updateActiveButton(filtre);
};

// Met à jour le bouton actif du filtre
function updateActiveButton(filtre) {
    document.querySelectorAll('.filtre button').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(filtre + "Button");
    if (btn) btn.classList.add('active');
}

// Compte les tâches
function compteurTaches() {
    document.getElementById("comptetout").textContent = taches.length;
    document.getElementById("comptefaire").textContent = taches.filter(t => !t.terminee).length;
    document.getElementById("comptefait").textContent = taches.filter(t => t.terminee).length;
}

// ================================================================== GESTION DU BUDGET =======================================================

// Quand on clique sur "ajouter une dépense"
document.getElementById("ajout-depenses").addEventListener("click", function() {
    const tbody = document.querySelector("#table tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${tbody.children.length + 1}</td>
        <td><input type="text" placeholder="Titre de la dépense"></td>
        <td><input type="number" min="0" value="0" class="montant-depense"></td>
    `;
    tbody.appendChild(tr);
    afficherBudgetResponsive();
});

// Affiche le budget en cartes sur mobile (inputs éditables)
function afficherBudgetCartes() {
    const cartes = document.getElementById("cartes-budget");
    const table = document.getElementById("table");
    if (!cartes || !table) return;
    cartes.innerHTML = "";

    // Pour chaque dépense du tableau, on crée une carte avec des inputs
    const lignes = table.querySelectorAll("tbody tr");
    lignes.forEach((tr, i) => {
        const inputs = tr.querySelectorAll("input");
        const titre = inputs[0]?.value || "";
        const montant = inputs[1]?.value || "0";
        const div = document.createElement("div");
        div.className = "carte-budget";
        div.innerHTML = `
            <label>Titre :
                <input type="text" value="${titre}" class="titre-depense-mobile">
            </label>
            <label>Montant :
                <input type="number" min="0" value="${montant}" class="montant-depense-mobile">
            </label>
        `;
        cartes.appendChild(div);

        // Synchronise les inputs mobile <-> table
        const inputTitreMobile = div.querySelector('.titre-depense-mobile');
        const inputMontantMobile = div.querySelector('.montant-depense-mobile');
        inputTitreMobile.addEventListener('input', function() {
            inputs[0].value = this.value;
        });
        inputMontantMobile.addEventListener('input', function() {
            inputs[1].value = this.value;
        });
    });
}

// Affichage responsive du budget
function afficherBudgetResponsive() {
    if (window.innerWidth <= 900) {
        afficherBudgetCartes();
    } else {
        const cartes = document.getElementById("cartes-budget");
        if (cartes) cartes.innerHTML = "";
    }
}

// Calcul du budget
document.getElementById("budget-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const depart = parseFloat(document.getElementById("depart").value) || 0;
    const gain = parseFloat(document.getElementById("gain").value) || 0;
    let totalDepenses = 0;

    document.querySelectorAll(".montant-depense").forEach(input => {
        totalDepenses += parseFloat(input.value) || 0;
    });

    const totalGains = gain;
    const soldeFinal = depart + gain - totalDepenses;

    document.getElementById("total-gains").textContent = totalGains.toFixed(2);
    document.getElementById("total-depenses").textContent = totalDepenses.toFixed(2);
    document.getElementById("solde-final").textContent = soldeFinal.toFixed(2);

    afficherBudgetResponsive();
});

// ======================================================= FAQ (Questions) ========================================================
// (Tu peux laisser ce bloc tel quel)
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.question .text').forEach(p => {
        p.style.display = "none";
    });
    document.querySelectorAll('.question-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const p = this.parentElement.querySelector('.text');
            if (p.style.display === "block") {
                p.style.display = "none";
            } else {
                p.style.display = "block";
            }
        });
    });
});

// ============================================================== MENU HAMBURGER RESPONSIVE ============================================
document.addEventListener("DOMContentLoaded", function() {
    // Header
    const hamburger = document.getElementById("header-menu");
    const nav = document.getElementById("header-nav");
    if (hamburger && nav) {
        hamburger.addEventListener("click", function() {
            nav.classList.toggle("montre");
        });
    }
    // Footer
    const btn = document.getElementById("footer-menu");
    const navFooter = document.getElementById("footer-nav");
    if (btn && navFooter) {
        btn.addEventListener("click", function() {
            navFooter.classList.toggle("montre");
        });
    }
});

// ========================================== RESPONSIVE : Réaffichage au redimensionnement =========================================
window.addEventListener('resize', () => {
    afficherTaches(defautFiltre);
    afficherBudgetResponsive();
});

// ==================================================== INITIALISATION ==============================================
afficherTaches();
compteurTaches();
afficherBudgetResponsive();