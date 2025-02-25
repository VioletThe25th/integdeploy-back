const express = require('express');
const User = require('../model/user');

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
        const { firstName, lastName, email, postalCode, city, birthday } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: 'Les champs firstName, lastName et email sont obligatoires.' });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            postalCode,
            city,
            birthday,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ user: savedUser });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});


module.exports = router;
