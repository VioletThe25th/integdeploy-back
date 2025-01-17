const axios = require('axios');

// Configuration de l'URL du serveur
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000";

// Fonction pour obtenir tous les utilisateurs
const getAllUsers = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        throw error;
    }
};

// Fonction pour créer un nouvel utilisateur
const createUser = async (userData) => {
    try {
        const response = await axios.post(`${SERVER_URL}/users`, userData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        throw error;
    }
};

// Fonction pour compter les utilisateurs
const countUsers = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}/users`);
        return response.data.users.length; // Adapté au champ `users` renvoyé par votre API
    } catch (error) {
        console.error("Erreur lors du comptage des utilisateurs :", error);
        throw error;
    }
};

module.exports = {
    getAllUsers,
    createUser,
    countUsers,
};
