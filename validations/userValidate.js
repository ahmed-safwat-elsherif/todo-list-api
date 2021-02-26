const User = require('../models/userModel')
const validate = (req, res, next) => {
    const { email } = req.body;
    if (typeof email !== "string") {
        res.status(401).send({ error: "invalid email or password" })
        return
    }
    next();
}
const userValidate = (req, res, next) => {
    const user = req.body
    if (user.email && typeof user.email !== "string") {
        res.status(400).send({ message: 'invalid email', success: false })
        return
    }
    if (user.password && typeof user.password !== "string") {
        res.status(400).send({ message: 'invalid password', success: false })
        return
    }
    if (user.firstName && typeof user.firstName !== "string") {
        res.status(400).send({ message: 'invalid first name', success: false })
        return
    } else if (user.firstName) {
        if (user.firstName.length < 3 || user.firstName.length > 15) {
            res.status(400).send({ message: 'invalid first name', success: false })
            return
        }
    }
    User.findOne({ email: user.email }, (err, userInDB) => {
        if (err) {
            res.status(400).send({ message: 'invalid email', success: false })
            return
        }
        console.log(userInDB)
        // console.log("req:",req.signData._id,"\n","userid:",userInDB._id)
        // console.log(req.signData._id== userInDB._id)
        if (userInDB && userInDB._id != req.signData._id) {
            res.status(400).send({ message: 'email registered before', success: false })
            return
        }
        next()
    })
}
module.exports = { validate, userValidate }