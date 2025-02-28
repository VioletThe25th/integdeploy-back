const express = require('express');
const User = require('../model/user');
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

/**
 * @swagger
 * /users/:
 *  get:
 *      security:
 *          - bearerAuth:   []
 *      tags:
 *          - Users
 *      summary: Return all users
 *      responses:
 *          200:
 *              description: A successful response
 *          500:
 *              description: Server error
 */
// Route pour obtenir tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

/**
 * @swagger
 * /users/:
 *  post:
 *      summary: Créer un nouvel utilisateur
 *      description: Ajoute un nouvel utilisateur à la base de données.
 *      tags:
 *          - Users
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          firstName:
 *                              type: string
 *                              example: "John"
 *                          lastName:
 *                              type: string
 *                              example: "Doe"
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: "john.doe@example.com"
 *                          postalCode:
 *                              type: string
 *                              example: "75000"
 *                          city:
 *                              type: string
 *                              example: "Paris"
 *                          birthday:
 *                              type: string
 *                              format: date
 *                              example: "1990-01-01"
 *      responses:
 *          201:
 *              description: Utilisateur créé avec succès
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: string
 *                                          example: "60d0fe4f5311236168a109ca"
 *                                      firstName:
 *                                          type: string
 *                                          example: "John"
 *                                      lastName:
 *                                          type: string
 *                                          example: "Doe"
 *                                      email:
 *                                          type: string
 *                                          format: email
 *                                          example: "john.doe@example.com"
 *          400:
 *              description: Erreur de validation
 *          500:
 *              description: Erreur serveur
 */
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, password, postalCode, city, birthday } = req.body;

        // Vérifie les champs obligatoires
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Les champs firstName, lastName, email et password sont obligatoires.' });
        }

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
        }

        // Création de l'utilisateur avec le rôle par défaut VISITEUR
        const newUser = new User({
            firstName,
            lastName,
            email,
            password, // 🔑 Le mot de passe est automatiquement haché grâce au hook dans le modèle
            postalCode,
            city,
            birthday,
            role: 'VISITEUR' // 🔑 Par défaut, rôle = VISITEUR
        });

        const savedUser = await newUser.save();
        res.status(201).json({ user: savedUser });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifie si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifie le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Génère un token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *      summary: Supprime un utilisateur
 *      description: Supprime un utilisateur de la base de données. Seuls les administrateurs peuvent effectuer cette action.
 *      tags:
 *          - Users
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: ID de l'utilisateur à supprimer
 *            schema:
 *                type: string
 *      responses:
 *          200:
 *              description: Utilisateur supprimé avec succès
 *          403:
 *              description: Accès refusé
 *          404:
 *              description: Utilisateur non trouvé
 *          500:
 *              description: Erreur serveur
 */

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Supprimer l'utilisateur
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });

    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
