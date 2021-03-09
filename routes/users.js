const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const Todo = require('../models/todoModel')
const TodoGroup = require('../models/todoGroupModel')
const bcrypt = require('bcrypt');
const { authenticate } = require('../auth/user');
const { validate, userValidate } = require('../validations/userValidate')

const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        console.log({email, password, firstName, lastName})
        let isExists = await User.countDocuments({ email });
        if (isExists > 0) {
            return res.status(400).send({ message: "Email already exists", success: false,exists:true })
        }
        const hash = await bcrypt.hash(password, 7);
        console.log({email, hash, firstName, lastName})
        
        const user = await User.create({ email, password: hash, firstName, lastName })
        res.statusCode = 201;
        res.send({ user, message: "User registered successfully", success: true })
    } catch (error) {
        res.statusCode = 422;
        res.send({ error, message: "failed to register", success: false })
    }
})

router.post('/login', validate, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).exec();
        if (!user) throw new Error("wrong email or password");
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) throw new Error("wrong email or password");
        const todos = await Todo.find({ userId: user._id, inGroup: false })
        const todoGroups = await TodoGroup.find({ userId: user._id })
        const token = jwt.sign({ _id: user._id }, 'the-attack-titan');
        res.statusCode = 200;
        let { firstName, lastName } = user;
        res.send({ message: "logged in successfully", email, firstName, lastName, token, todos, todoGroups, success: true })
    } catch (error) {
        res.statusCode = 401;
        res.send({ error: "Invalid credentials", success: false })
    }
})

router.get('/profile', authenticate, async (req, res) => {
    try {
        const _id = req.signData._id;
        console.log(_id)

        const user = await User.findOne({ _id });
        delete user.password;
        const todos = await Todo.find({ userId: user._id, inGroup: false })
        const todoGroups = await TodoGroup.find({ userId: user._id })
        res.status(201).send({user, success: true, todos, todoGroups })
    } catch (error) {
        res.status(401).send({ error, message: 'user not found', success: false })
    }
})

router.route('/')
    .delete(authenticate, async (req, res) => {
        try {
            const { _id } = req.signData;
            await User.deleteOne({ _id });
            await Todo.deleteMany({ userId: _id });
            await TodoGroup.deleteMany({ userId: _id })
            res.status(200).send({ message: "user was deleted successfully", _id, success: true });
        } catch (error) {
            res.status(401).send({ error, success: false })
        }
    })
    .patch(authenticate, userValidate, async (req, res) => {
        const { _id } = req.signData;
        let user = await User.findOne({ _id });

        console.log(_id)
        const newUpdate = req.body;
        const isMatched = await bcrypt.compare(newUpdate.password, user.password);
        if (!isMatched) {
            return res.status(401).send({ message: "Wrong password", success: false })
        }
        delete newUpdate.password;
        console.log(newUpdate)
        User.findOneAndUpdate({ _id }, newUpdate, {
            new: true
        }, (error, user) => {
            if (error) {
                res.status(400).send({ error, message: "failed to update", success: false })
                return;
            }
            res.status(200).send({ message: "user was edited successfully", user, success: true })
        })
    })

router.patch('/change/password', authenticate, async (req, res) => {
    try {
        let { _id } = req.signData;
        let { password, newPassword } = req.body;
        let user = await User.findOne({ _id })
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            res.status(400).send({ message: "old password is not correnct", success: false })
        }
        password = await bcrypt.hash(newPassword, 7);
        await User.findByIdAndUpdate({ _id }, { password });
        res.status(200).send({ message: "Password has changed", success: true })
    } catch (error) {
        res.status(404).send({ message: "Cannot change password", success: false })
    }
})
module.exports = router