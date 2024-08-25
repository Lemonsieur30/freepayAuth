
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Activation de CORS pour permettre les requêtes provenant de différents domaines
app.use(cors());

// Utilisation de body-parser pour analyser les données du corps de la requête
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Configurer la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: process.DB_HOST,
  user: process.DB_USER,
  password: process.DB_PASSWORD,
  database: process.DB_NAME
});

// Vérifier la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à la base de données');
});

// Importer les routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


// Définir le port d'écoute
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gérer les erreurs
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur du serveur' });
});
