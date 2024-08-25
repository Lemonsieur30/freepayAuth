
const bcrypt = require('bcrypt');
const db = require('../config/server'); // Importer la connexion à la base de données

// Définition de la classe User
class User {

  constructor(
    ID_Utilisateur,
    Nom_Utilisateur,
    Prenom_Utilisateur,
    Date_Naissance,
    Email,
    Telephone,
    Mot_De_Passe,
    Solde_courant,
    solde_commsion,
    Role,
    ID_Parrain,
    code_parrainage,
    ResetPasswordToken,
    resetPasswordExpires 
  ) {
    this.ID_Utilisateur = ID_Utilisateur;
    this.Nom_Utilisateur = Nom_Utilisateur;
    this.Prenom_Utilisateur = Prenom_Utilisateur;
    this.Date_Naissance = Date_Naissance;
    this.Email = Email;
    this.Telephone = Telephone;
    this.Mot_De_Passe = Mot_De_Passe;
    this.Solde_courant = Solde_courant;
    this.solde_commsion = solde_commsion;
    this.Role = Role;
    this.ID_Parrain = ID_Parrain;
    this.code_parrainage = code_parrainage;
    this.ResetPasswordToken =  ResetPasswordToken ;
    this.resetPasswordExpires=resetPasswordExpires;
  }

  // Méthodes d'instance

  async save() {
    try {
      // Hacher le mot de passe avant de l'enregistrer
      this.Mot_De_Passe = await bcrypt.hash(this.Mot_De_Passe, 10);

      // Enregistrer l'utilisateur dans la base de données
      const [rows] = await db.query(
        'INSERT INTO utilisateurs SET ?',
        this
      );

      if (rows.affectedRows === 1) {
        return true; // Insertio réussie
      } else {
        return false; // Échec de l'insertion
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update() {
    try {
      // Mettre à jour l'utilisateur dans la base de données
      const [rows] = await db.query(
        'UPDATE utilisateurs SET ? WHERE ID_Utilisateur = ?',
        [this, this.ID_Utilisateur]
      );

      if (rows.affectedRows === 1) {
        return true; // Mise à jour réussie
      } else {
        return false; // Échec de la mise à jour
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete() {
    try {
      const [rows] = await db.query(
        'DELETE FROM utilisateurs WHERE ID_Utilisateur = ?',
        [this.ID_Utilisateur]
      );

      if (rows.affectedRows === 1) {
        return true; // Suppression réussie
      } else {
        return false; // Échec de la suppression
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.Mot_De_Passe); // Compare le mot de passe avec le hachage
  }

  
// Fonction pour rechercher un utilisateur par son code de parrainage
exports.findByCodeParrainage = async (codeParrainage) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM utilisateurs WHERE code_parrainage = ?', [codeParrainage]);
    return rows.length > 0 ? rows[0] : null; // Renvoyer l'utilisateur si trouvé, sinon null
  } catch (error) {
    console.error('Erreur:', error);
    throw error; 
  }
};

  // Méthodes statiques pour interagir avec la base de données

  static async findByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM utilisateurs WHERE Email = ?',
        [email]
      );
      if (rows.length > 0) {
        // Créer un nouvel objet User à partir des données de la base de données
        return new User(
          rows[0].ID_Utilisateur,
          rows[0].Nom_Utilisateur,
          rows[0].Prenom_Utilisateur,
          rows[0].Date_Naissance,
          rows[0].Email,
          rows[0].Telephone,
          rows[0].Mot_De_Passe,
          rows[0].Solde_courant,
          rows[0].solde_commsion,
          rows[0].Role,
          rows[0].ID_Parrain,
          rows[0].code_parrainage
        );
      } else {
        return null; // Renvoie null si non trouvé
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM utilisateurs WHERE ID_Utilisateur = ?',
        [id]
      );
      if (rows.length > 0) {
        // Créer un nouvel objet User à partir des données de la base de données
        return new User(
          rows[0].ID_Utilisateur,
          rows[0].Nom_Utilisateur,
          rows[0].Prenom_Utilisateur,
          rows[0].Date_Naissance,
          rows[0].Email,
          rows[0].Telephone,
          rows[0].Mot_De_Passe,
          rows[0].Solde_courant,
          rows[0].solde_commsion,
          rows[0].Role,
          rows[0].ID_Parrain,
          rows[0].code_parrainage
        );
      } else {
        return null; // Renvoie null si non trouvé
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findByResetPasswordToken(ResetPasswordToken)  {
    try {
      const [rows] = await db.query(
        'SELECT * FROM utilisateurs WHERE ResetPasswordToken = ?',
        [ResetPasswordToken]
      );
      if (rows.length > 0) {
        // Créer un nouvel objet User à partir des données de la base de données
        return new User(
          rows[0].ID_Utilisateur,
          rows[0].Nom_Utilisateur,
          rows[0].Prenom_Utilisateur,
          rows[0].Date_Naissance,
          rows[0].Email,
          rows[0].Telephone,
          rows[0].Mot_De_Passe,
          rows[0].Solde_courant,
          rows[0].solde_commsion,
          rows[0].Role,
          rows[0].ID_Parrain,
          rows[0].code_parrainage
        );
      } else {
        return null; // Renvoie null si non trouvé
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  static async generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
}

module.exports = User;