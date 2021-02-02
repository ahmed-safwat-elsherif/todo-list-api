const express = require('express')
const router = express.Router('mergeParams')
const Todo = require('../models/todoModel')
const { authenticate } = require('../auth/user');
const {todoValidate} = require('../validations/todoValidate')
router.route('/')
    .get(authenticate, (req, res, next) => {
        let { limit = 10, skip = 0 } = req.query;
        const userId = req.signData._id
        if (Number(limit) > 25) {
            limit = 25;
        }
        Todo.find({ userId }).skip(Number(skip)).limit(Number(limit)).sort({updatedAt: -1}).exec((err, todos) => {
            if (err) {
                res.status(401).send(err)
                return
            }
            res.status(200).send({ length: todos.length, todos })
        });
    })
    .post(authenticate, (req, res, next) => {
        const { _id } = req.signData
        const userId = _id;
        const { title, body, tags } = req.body;
        Todo.create({ userId, title, body, tags }, function (error, todo) {
            if (error) {
                res.send({ error })
                return;
            }
            res.status(201)
            res.send({ message: "a To-do was added successfully" })
        });
    })

router.patch('/:_id',authenticate, (req, res, next) => {
    const userId = req.signData._id;
    const { _id } = req.params;
    let newUpdate = req.body;
    const isValid = todoValidate(newUpdate);
    console.log(isValid)
    newUpdate['updatedAt'] = Date.now();
    Todo.findOneAndUpdate({ _id,userId }, newUpdate, {
        new: true
    }, (error, todo) => {
        if (error) {
            res.send({ error })
            return;
        }
        res.send({ message: "To-do was edited successfully", todo })
    })
})

router.delete('/:_id',authenticate, (req, res, next) => {
    const userId = req.signData._id;
    const { _id } = req.params;
    Todo.deleteOne({ _id,userId }, (error) => {
        if (error) {
            res.send({ error })
            return;
        }
        res.status(200)
        res.send({ message: "To-do was deleted successfully", _id })
    })
})

module.exports = router