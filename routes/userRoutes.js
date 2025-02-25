const express = require('express');
const User = require('../model/user');

const router = express.Router();

/**
 * @description Get All users
 * @route GET /users/
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
 * @description POST One new user
 * @route POST /users/
 * @swagger
 * /users/:
 *  post:
 *      security:
 *          - bearerAuth    []
 *      tags:
 *          - Users
 *      summary: Create one user
 *      responses:
 *          201:
 *              description: A successful response
 *          500:
 *              description: Server error
 *          400:
 *              description: Bad credentials
 */
// Route pour créer un nouvel utilisateur
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
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
