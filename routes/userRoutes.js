const express = require('express');
const User = require('../model/user');

const router = express.Router();

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
