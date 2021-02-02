const User = require('../models/userModel')
const validate = (req, res, next) => {
    const { username } = req.body;
    if (typeof username !== "string") {
        res.status(401).send({ error: "invalid username or password" })
        return
    }
    next();
}
const userValidate = (req, res, next) => {
    const user = req.body
    if (user.username && typeof user.username !== "string") {
        res.status(400).send({ message: 'invalid username', valid: false })
        return
    }
    if (user.password && typeof user.password !== "string") {
        res.status(400).send({ message: 'invalid password', valid: false })
        return
    }
    if (user.firstName && typeof user.firstName !== "string") {
        res.status(400).send({ message: 'invalid first name', valid: false })
        return
    } else if (user.firstName) {
        if (user.firstName.length < 3 || user.firstName.length > 15) {
            res.status(400).send({ message: 'invalid first name', valid: false })
            return
        }
    }
    if (user.age && user.age < 13) {
        res.status(400).send({ message: 'invalid age', valid: false })
        return
    }
    User.findOne({ username: user.username }, (err, user) => {
        if (err) {
            res.status(400).send({ message: 'invalid age', valid: false })
            return
        }
        if (user) {
            res.status(400).send({ message: 'username exists', valid: false })
            return
        }
        next()
    })
}
module.exports = { validate, userValidate }