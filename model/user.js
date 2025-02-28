// src/model/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    postalCode: String,
    city: String,
    birthday: Date,
    role: { type: String, enum: ['VISITEUR', 'ADMIN'], default: 'VISITEUR' } // 🔑 Ajout du rôle
}, { timestamps: true });

// 🔒 Hachage du mot de passe avant de sauvegarder l'utilisateur
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
