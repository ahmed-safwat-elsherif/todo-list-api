const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 15
    },
    age: {
        type: Number,
        min: 13
    }
},{ strict: true })

const User = mongoose.model('User', userSchema);

module.exports = User