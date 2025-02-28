const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { specs, swaggerUi } = require('./swagger');

dotenv.config();

mongoose.set('strictQuery', false);

// Connexion à MongoDB
const mongoDB = process.env.MONGODB_URL;

main().catch((err) => console.error('Erreur de connexion à MongoDB:', err));
async function main() {
    await mongoose.connect(mongoDB);
    console.log('Connecté au serveur MongoDB');
}

const app = express();

const allowedOrigins = [
    process.env.FRONT_URL,
    process.env.FRONT_DEPLOY
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello world');
});

module.exports = app;
