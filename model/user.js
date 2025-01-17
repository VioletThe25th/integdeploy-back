const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    postalCode: String,
    city: String,
    birthday: Date,
});


module.exports = mongoose.model("User", UserSchema);