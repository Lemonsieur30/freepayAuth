
const User = require('../models/User');

// Définition du contrôleur Login
const loginController = {

  // Fonction pour la connexion d'un utilisateur
  async login(req, res) {

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); // Renvoyer les erreurs de validation
    }

    try {
      const { Email, Mot_De_Passe } = req.body;

      // Trouver l'utilisateur par son email
      const user = await User.findByEmail(Email);

      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await user.comparePassword(Mot_De_Passe);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = loginController;
