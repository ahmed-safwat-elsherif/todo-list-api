const jwt = require('jsonwebtoken');
const fs = require('fs');
module.exports.authenticate = (req, res, next) => {
    try {
        const {authorization} = req.headers;
        const signData = jwt.verify(authorization, 'the-attack-titan');
        req.signData = signData;
        next();
    } catch (error) {
        res.statusCode = 401;
        res.send({success: false, error:"Authorization failed"});
    }
}