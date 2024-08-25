
const express = require('express');
const router = express.Router();
const authController = require('../controllers/registerController');
const authController = require('../controllers/loginController');
const authController = require('../controllers/passwordRecoveryController');
const { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } = require('../utils/validation');

// Route pour l'inscription
router.post('/register', registerValidation, authController.register);

// Route pour la connexion
router.post('/login', loginValidation, authController.login);

// Route pour envoyer un email de réinitialisation de mot de passe
router.post('/forgot-password', forgotPasswordValidation, authController.sendResetPasswordEmail);

// Route pour réinitialiser le mot de passe
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);


// Route pour obtenir les informations de l'utilisateur actuel
router.get('/', authMiddleware, userController.getCurrentUser);

// Route pour mettre à jour le profil de l'utilisateur
router.put('/profile', authMiddleware, userController.updateProfile);

// Route pour obtenir la liste des utilisateurs
router.get('/', authMiddleware, userController.getUsers);

// Route pour obtenir les informations d'un utilisateur spécifique
router.get('/:id', authMiddleware, userController.getUserById);

// Route pour supprimer un utilisateur
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;

