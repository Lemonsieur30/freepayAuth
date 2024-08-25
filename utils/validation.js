
const { check, body } = require('express-validator');

// Définition des fonctions de validation

// Validation de l'inscription
exports.registerValidation = [
  check('Nom_Utilisateur')
    .notEmpty()
    .withMessage('Le nom d'utilisateur est obligatoire')
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom d'utilisateur doit contenir entre 3 et 50 caractères'),
  check('Prenom_Utilisateur')
    .notEmpty()
    .withMessage('Le prénom est obligatoire')
    .isLength({ min: 3, max: 50 })
    .withMessage('Le prénom doit contenir entre 3 et 50 caractères'),
  check('Email')
    .notEmpty()
    .withMessage('L\'email est obligatoire')
    .isEmail()
    .withMessage('L\'email est invalide')
    .custom(async (value) => {
      try {
        // Vérifier si l'email existe déjà dans la base de données
        const existingUser = await User.findByEmail(value);
        if (existingUser) {
          throw new Error('Cet email est déjà utilisé');
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
  check('Telephone')
    .optional()
    .isNumeric()
    .withMessage('Le numéro de téléphone doit être un nombre'),
  check('Mot_De_Passe')
    .notEmpty()
    .withMessage('Le mot de passe est obligatoire')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
    .withMessage('Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial'),
  check('codeParrainage')
    .optional() // Le code de parrainage est facultatif
    .custom(async (value) => {
      try {
        if (value) {
          // Vérifier si le code de parrainage est valide
          const parrain = await User.findByCodeParrainage(value);
          if (!parrain) {
            throw new Error('Code de parrainage invalide');
          }
        }
        return true;
      } catch (error) {
        throw error;
      }
    })
];

// Validation de la connexion
exports.loginValidation = [
  check('Email')
    .notEmpty()
    .withMessage('L\'email est obligatoire')
    .isEmail()
    .withMessage('L\'email est invalide'),
  check('Mot_De_Passe')
    .notEmpty()
    .withMessage('Le mot de passe est obligatoire')
];

// Validation de la récupération de mot de passe
exports.forgotPasswordValidation = [
  check('Email')
    .notEmpty()
    .withMessage('L\'email est obligatoire')
    .isEmail()
    .withMessage('L\'email est invalide')
];

// Validation de la réinitialisation de mot de passe
exports.resetPasswordValidation = [
  check('resetToken')
    .notEmpty()
    .withMessage('Le token de réinitialisation est obligatoire'),
  check('newPassword')
    .notEmpty()
    .withMessage('Le nouveau mot de passe est obligatoire')
    .isLength({ min: 8 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
    .withMessage('Le nouveau mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial')
];

