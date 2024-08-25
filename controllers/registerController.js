
const User = require('../models/User');
const { validationResult } = require('express-validator'); // Importer express-validator

// Définition du contrôleur Register
const registerController = {

  // Fonction pour l'inscription d'un utilisateur
  async register(req, res) {
  

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); // Renvoie des erreurs de validation
    }

    try {
      const {
        Nom_Utilisateur,
        Prenom_Utilisateur,
        Date_Naissance,
        Email,
        Telephone,
        Mot_De_Passe,
        codeParrainage // Code de parrainage fourni dans la requête
      } = req.body;

      // Vérifier si le code de parrainage est valide
      let parrain = null;
      if (codeParrainage) {
        parrain = await User.findByCodeParrainage(codeParrainage); // Implémenter la fonction findByCodeParrainage dans User.js
        if (!parrain) {
          return res.status(400).json({ message: 'Code de parrainage invalide' });
        }
      }

      // Créer un nouvel utilisateur
      const newUser = new User(
        null, // ID_Utilisateur (généré automatiquement)
        Nom_Utilisateur,
        Prenom_Utilisateur,
        Date_Naissance,
        Email,
        Telephone,
        Mot_De_Passe,
        0.00, // Solde_courant
        0, // solde_commsion
        'user', // Role
        parrain ? parrain.ID_Utilisateur : null, // ID_Parrain (si un parrain existe)
        null // code_parrainage (sera généré automatiquement)
      );

      // Enregistrer l'utilisateur
      const result = await newUser.save();

      if (result) {
        return res.status(201).json({ message: 'Utilisateur créé avec succès' });
      } else {
        return res.status(500).json({ message: 'Échec de la création de l\'utilisateur' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = registerController;


