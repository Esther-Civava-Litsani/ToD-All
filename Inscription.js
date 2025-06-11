// Attendre que le contenu de la page (DOM) soit entièrement chargé
document.addEventListener('DOMContentLoaded', function () {

  // Fonction qui vérifie si le mot de passe et sa confirmation correspondent
  function checkPasswordMatch() {
    // Récupération de la valeur du champ du mot de passe
    const password = document.getElementById('mot').value;
    // Récupération de la valeur du champ de confirmation du mot de passe
    const confirmPassword = document.getElementById('confirm_mot').value;
    // Sélection de l'élément qui affichera le message de validation
    const messageEl = document.getElementById('passwordMessage');

    // Si le champ de confirmation est vide, notifier l'utilisateur
    if (confirmPassword.trim() === '') {
      messageEl.textContent = "Veuillez confirmer votre mot de passe";
      messageEl.style.color = "red";
      return false;
    }

    // Vérifier si les deux valeurs sont exactement identiques
    if (password === confirmPassword) {
      // Si c'est le cas, afficher un message positif en vert
      messageEl.textContent = "Les mots de passe correspondent";
      messageEl.style.color = "green";
      return true;
    } else {
      // Sinon, afficher une erreur en rouge
      messageEl.textContent = "Les mots de passe ne correspondent pas";
      messageEl.style.color = "red";
      return false;
    }
  }

  // Ajouter des écouteurs d'événements sur les champs de saisie pour effectuer une vérification en temps réel
  document.getElementById('mot').addEventListener('input', checkPasswordMatch);
  document.getElementById('confirm_mot').addEventListener('input', checkPasswordMatch);

  // Gestion de la soumission du formulaire
  document.getElementById('inscriptionForm').addEventListener('submit', function (event) {
    // Si la vérification des mots de passe échoue, empêcher la soumission du formulaire
    if (!checkPasswordMatch()) {
      event.preventDefault();
    }
  });
});

