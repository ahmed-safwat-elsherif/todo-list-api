const express = require('express')
const router = express.Router('mergeParams')
const Todo = require('../models/todoModel')
const TodoGroup = require('../models/todoGroupModel')
const { authenticate } = require('../auth/user');
router.get('/', authenticate, async (req, res) => {
    let { limit = 10, skip = 0 } = req.query;
    const userId = req.signData._id
    if (Number(limit) > 10) {
        limit = 10;
    }
    TodoGroup.find({ userId }).skip(Number(skip)).limit(Number(limit)).sort({updatedAt: -1}).exec((err, todoGroups) => {
        if (err) {
            res.status(404).send({ message: "error just happened in retreiving todo groups", err, success: false })
            return
        }
        res.status(200).send({ todoGroups, message: "All Todo Groups are retreived successfully", success: true })
    });
})
router.post('/todogroup',authenticate, async (req, res) => {
    try {
        let userId = req.signData._id;
        let { title, body, tags = [],status } = req.body;
        let todoGroup = await TodoGroup.create({ title, userId, body, tags,status })
        res.status(200).send({ message: "Todo group is created", todoGroup, success: true })
    } catch (error) {
        res.status(400).send({ message: "Todo group failed to be created", error, success: false })
    }
})
router.route('/todogroup/:_id')
    .get(authenticate, async (req, res) => {
        try {
            let userId = req.signData._id;
            let {_id} = req.params;
            let todoGroup = await TodoGroup.findOne({ userId,_id });
            let todos = await Todo.find({ todoGroupId: _id })
            res.status(200).send({ todoGroup, todos, message: "All Todo Group is retreived successfully", success: true })
        } catch (error) {
            res.status(404).send({ message: "error just happened in retreiving todo group", error, success: false })
        }
    })
    .patch(authenticate, async (req, res) => {
        try {
            let userId = req.signData._id;
            let { title, body, tags, _id,status } = req.body;
            let todoGroup = await TodoGroup.findOneAndUpdate({ _id }, { title, body, tags,status }, {
                new: true
            }).exec()
            res.status(200).send({ message: "Todo group is updated", todoGroup, success: true })
        } catch (error) {
            res.status(400).send({ message: "Todo group failed to update", success: false, error })
        }
    })
    .delete(authenticate, async (req, res) => {
        try {
            let userId = req.signData._id;
            let { _id } = req.body;
            await TodoGroup.findByIdAndDelete({ _id })
            await Todo.findByIdAndDelete({ todoGroupId: _id })
            let todoGroups = await TodoGroup.find();
            res.status(200).send({ message: "Todo group is deleted", success: true, todoGroups})
        } catch (error) {
            res.status(400).send({ message: "Todo group failed to delete", success: false })
        }
    })

router.route('/new/todo')
    .post(authenticate, async (req, res) => {
        try {
            let userId = req.signData._id;
            let { todoGroupId, title = '', body = '', tags = [],status } = req.body;
            let newTodo = await Todo.create({ userId, todoGroupId, title,inGroup:true,body , tags, status })
            res.status(200).send({ message: "Todo is created and added to todo group successfully", newTodo, success: true })
        } catch (error) {
            res.status(400).send({ message: "Todo failed to be created or added to todo group", error, success: false })
        }
    })


router.route('/existing/todo/:_id') /// still working here 
    .post(authenticate, async (req, res) => {
        try {
            let userId = req.signData._id;
            let {_id} = req.params;
            let { todoGroupId } = req.body;
            let todo = await Todo.findOneAndUpdate({ _id },{todoGroupId,inGroup:true},{
                new:true
            }).exec();
            res.status(200).send({ message: "Todo is created and added to todo group successfully", todo, success: true })
        } catch (error) {
            res.status(400).send({ message: "Todo failed to be created or added to todo group", error, success: false })
        }
    })

// router.delete('/delete/todo',authenticate, async (req, res) => {
//     try {
//         let userId = req.signData._id;
//         let { _id, todoGroupId } = req.body;
//         await Todo.deleteOne({ _id, userId, todoGroupId })
//         res.status(200).send({ message: "Todo is removed successfully", success: true })
//     } catch (error) {
//         res.status(400).send({ message: "Todo is removed successfully", success: false })
//     }
// })

module.exports = router;