
const User = require('../models/User');
const { validationResult } = require('express-validator'); // Importer express-validator
const bcrypt = require('bcrypt'); // Importer bcrypt
const nodemailer = require('nodemailer'); // Importer nodemailer (pour envoyer des emails)

// Définition du contrôleur PasswordRecovery
const passwordRecoveryController = {

  // Fonction pour envoyer un email de réinitialisation de mot de passe
  async sendResetPasswordEmail(req, res) {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); // on renvoit les erreurs de validation
    }

    try {
      const { Email } = req.body;

      // Trouver l'utilisateur par son email
      const user = await User.findByEmail(Email);

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      // Générer un token de réinitialisation
      const resetToken = await generateRandomCode(length); // Générer un token aléatoire

      // Stocker le token dans la base de données 
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Le token expire dans 1 heure
      await user.update();

      // Configurer le transport d'email 
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'email',
          pass: 'password' 
        }
      });

      // Envoyer l'email de réinitialisation
      const mailOptions = {
        from: 'email', 
        to: Email,
        subject: 'Réinitialisation de mot de passe',
        html: `
          <p>Bonjour ${user.Nom_Utilisateur},</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe:</p>
          <a href="http://../reset-password/${resetToken}">Réinitialiser le mot de passe</a>
          <p>Ce lien expire dans 1 heure.</p>
        `
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Fonction pour réinitialiser le mot de passe
  async resetPassword(req, res) {

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); // Renvoie des erreurs de validation
    }

    try {
      const { resetToken, newPassword } = req.body;

      // Trouver l'utilisateur par son token de réinitialisation
      const user = await User.findByResetPasswordToken(resetToken); 

      if (!user) {
        return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré' });
      }

      // Vérifier si le token n'est pas expiré
      if (user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: 'Token de réinitialisation expiré' });
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe de l'utilisateur
      user.Mot_De_Passe = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.update();

      return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = passwordRecoveryController;
