

// Fonction pour formater une date au format "jj-mm-aaaa"
exports.formatDate = (date) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

// Fonction pour hacher un mot de passe en utilisant bcrypt
exports.hashPassword = async (password) => {
  const saltRounds = 10; // Nombre de tours de hachage (recommandé: 10 ou plus)
  return bcrypt.hash(password, saltRounds); // Hacher le mot de passe
};

// Fonction pour comparer un mot de passe avec son hachage stocké en base de données
exports.comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword); // Comparer le mot de passe avec son hachage
};

// Fonction pour générer un token JWT
exports.generateJWT = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn }); // Générer un token JWT
};

// Fonction pour vérifier la validité d'un token JWT
exports.verifyJWT = (token, secret) => {
  return jwt.verify(token, secret); // Vérifier le token JWT
};

// Fonction pour envoyer un email en utilisant nodemailer
exports.sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'votre_email@gmail.com', // Votre adresse email
      pass: 'votre_mot_de_passe' // Votre mot de passe
    }
  });
  return transporter.sendMail(mailOptions); // Envoyer l'email
};


// Fonction pour formater un nombre en monnaie
exports.formatCurrency = (amount) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }); // Formater le nombre en monnaie EUR
};

// Fonction pour tronquer un texte à une certaine longueur
exports.truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
