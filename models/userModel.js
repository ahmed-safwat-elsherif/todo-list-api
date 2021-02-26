const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = Schema({
    email: {
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
        minlength: 3,
        maxlength: 15
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 15
    }
},
{ timestamps: { createdAt: 'createdAt' } })

userSchema.path('email').validate((val)=>{
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    if(val.match(regex)){
        return true
    }
    return false
})
const User = mongoose.model('User', userSchema);

module.exports = User