
const User = require('../models/User');

// Définition du contrôleur User
const userController = {

  // Fonction pour l'inscription d'un utilisateur
  async register(req, res) {
  
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); // Renvoyer les erreurs de validation
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

      // Vérifie si le code de parrainage est valide
      let parrain = null;
      if (codeParrainage) {
        parrain = await User.findByCodeParrainage(codeParrainage); 
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
  },

  // Fonction pour la mise à jour des informations d'un utilisateur
  async update(req, res) {

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); // Renvoie des erreurs de validation
    }

    try {
      const { ID_Utilisateur } = req.params; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

      // Vérifier si l'utilisateur existe
      const userToUpdate = await User.findById(ID_Utilisateur);
      if (!userToUpdate) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      const {
        Nom_Utilisateur,
        Prenom_Utilisateur,
        Date_Naissance,
        Email,
        Telephone,
        Mot_De_Passe
      } = req.body;

      // Mettre à jour les attributs de l'utilisateur
      userToUpdate.Nom_Utilisateur = Nom_Utilisateur;
      userToUpdate.Prenom_Utilisateur = Prenom_Utilisateur;
      userToUpdate.Date_Naissance = Date_Naissance;
      userToUpdate.Email = Email;
      userToUpdate.Telephone = Telephone;
      userToUpdate.Mot_De_Passe = Mot_De_Passe;

      const result = await userToUpdate.update();

      if (result) {
        return res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
      } else {
        return res.status(500).json({ message: 'Échec de la mise à jour de l\'utilisateur' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Fonction pour la suppression d'un utilisateur
  async delete(req, res) {
    try {
      const { ID_Utilisateur } = req.params; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

      // Vérifier si l'utilisateur existe
      const userToDelete = await User.findById(ID_Utilisateur);
      if (!userToDelete) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      const result = await userToDelete.delete();

      if (result) {
        return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
      } else {
        return res.status(500).json({ message: 'Échec de la suppression de l\'utilisateur' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = userController;
