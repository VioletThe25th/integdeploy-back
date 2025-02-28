// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Récupère le token depuis le header Authorization
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Accès non autorisé, token manquant.' });
        }

        // Vérifie le format du token (doit commencer par "Bearer ")
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7, authHeader.length).trim() : null;
        if (!token) {
            return res.status(401).json({ message: 'Format du token invalide.' });
        }

        // Vérification du token avec JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Vérifie le rôle de l'utilisateur
        console.log("Role de l'utilisateur :", req.user.role);
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent supprimer des utilisateurs.' });
        }

        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);
        return res.status(401).json({ message: 'Token invalide.' });
    }
};

module.exports = authMiddleware;
