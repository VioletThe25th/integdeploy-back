const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const User = require('./model/user');

dotenv.config();

mongoose.set('strictQuery', false);

// Define the database URL to connect to
const mongoDB = process.env.MONGODB_URL;

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);

    console.log('Connected to mongo server');
}

/**
 * @description Get All note
 * @route GET /users
 */
const getAllUsers = (
    async function (req, res, next) {
        try {
            const users = await User.find({})
            return res.status(200).json({ users: users });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
)

/**
 * @description Create a new user
 * @route POST /users
 */
const createUser = async function (req, res, next) {
    try {
        // Extraction des données de l'utilisateur depuis le corps de la requête
        const { firstName, lastName, email, postalCode, city, birthday } = req.body;

        // Vérification de la présence des données obligatoires
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: 'Les champs firstName, lastName et email sont obligatoires.' });
        }

        // Création d'un nouvel utilisateur
        const newUser = new User({
            firstName,
            lastName,
            email,
            postalCode,
            city,
            birthday,
        });

        // Sauvegarde dans la base de données
        const savedUser = await newUser.save();

        // Réponse avec les données sauvegardées
        return res.status(201).json({ user: savedUser });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.', error });
    }
};

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);

const app = express();

const corsOptions = {
    origin: process.env.FRONT_URL,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// API Routes

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use('/users', router);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = app;