const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const Todo = require('../models/todoModel')
const bcrypt = require('bcrypt');
const {authenticate} = require('../auth/user');
const {validate,userValidate} = require('../validations/userValidate')

const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
    try {
        const { username, password, firstName, age } = req.body;
        const hash = await bcrypt.hash(password, 7);
        const user = await User.create({ username, password: hash, firstName, age })
        res.statusCode = 201;
        res.send({ user, message: { success: true } })
    } catch (error) {
        res.statusCode = 422;
        res.send({ error })
    }
})

router.post('/login',validate, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).exec();
        if (!user) throw new Error("wrong username or password");
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) throw new Error("wrong username or password");
        const latestTodos = await Todo.find({ userId:user._id }).populate('userId','username')
        const token = jwt.sign({ _id: user._id }, 'the-attack-titan');
        res.statusCode = 200;
        res.send({ message: "logged in successfully", username: user.username,token, latestTodos })
    } catch (error) {
        res.statusCode = 401;
        res.send({error:"Invalid credentials"})
    }
})

router.get('/profile',authenticate, async (req,res) => {
    try {
        const _id = req.signData._id;
        const {username, firstName, age} = await User.findOne({_id}).exec();
        const latestTodos = await Todo.find({ userId:_id }).populate('userId','username');
        res.status(201).send({username, firstName, age,latestTodos})
    } catch (error) {
        res.status(401).send({error,message:'user not found'})
    }
})

router.route('/')
.get(authenticate,(req, res) => {
    User.find({ firstName: { $exists: true } }, (err, users) => {
        if (err) {
            res.statusCode = 400;
            res.status(400).send({ err })
            return;
        }
        res.status(200).send(users.map((user) => user.firstName))
    })
})
.delete(authenticate,(req, res) => {
        const { _id } = req.signData;
        User.deleteOne({ _id }, (error) => {
            if (error) {
                res.status(401)
                res.send({ error })
                return;
            }
            res.status(200);
            res.send({ message: "user was deleted successfully", _id });
        })
})
.patch(authenticate,userValidate, async (req, res) => {
    const { _id } = req.signData;
    console.log(_id)
    const newUpdate = req.body;
    if(newUpdate.password){
        newUpdate.password = await bcrypt.hash(newUpdate.password, 7);
    }

    User.findOneAndUpdate({ _id }, newUpdate,{
        new: true
    }, (error, user) => {
        if (error) {
            res.send({ error })
            return;
        }
        res.send({ message: "user was edited successfully", user })
    })
})

module.exports = router