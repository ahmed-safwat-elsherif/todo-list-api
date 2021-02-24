const express = require('express')
const router = express.Router('mergeParams')
const Todo = require('../models/todoModel')
const TodoGroup = require('../models/todoModel')
const { authenticate } = require('../auth/user');
const { post } = require('./todos');
/*
 get all todo

    get all todos
    get a specific todo
    update a todogroup
    add an existing todo to a todogroup
    add a new todo to a todogroup
    remove a todo from a todogroup
    remove a group 

*/

router.get('/',authenticate,async(req,res)=>{
    try {
        let userId = req.signData._id;
        let todoGroups = await TodoGroup.find({userId})
        res.status(200).send({todoGroups,message:"All Todo Groups are retreived successfully",success:true})
    } catch (error) {
        res.status(404).send({message:"error just happened in retreiving todo groups",error,success:false})
    }
})

router.route('/todogroup')
    .get(authenticate,async(req,res)=>{
        try {
            let userId = req.signData._id;
            let todoGroup = await TodoGroup.findOne({userId});
            let todos = await Todo.find({todoGroupId:todoGroup._id})
            res.status(200).send({todoGroup,todos,message:"All Todo Group is retreived successfully",success:true})
        } catch (error) {
            res.status(404).send({message:"error just happened in retreiving todo group",error,success:false})
        }
    })
    .post(authenticate,async(req,res)=>{
        try {
            let userId = req.signData._id;
            let {title,body,tags=[]} = req.body;
            let todoGroup = await TodoGroup.create({title,userId,body,tags})
            res.status(200).send({message:"Todo group is created", todoGroup,success:true})
        } catch (error) {
            res.status(400).send({message:"Todo group failed to be created", error,success:false})
        }
    })
    .patch(authenticate,async(req,res)=>{
        try {
            let userId = req.signData._id;
            let {title,body,tags,_id} = req.body;
            let todoGroup = await TodoGroup.findOneAndUpdate({_id},{title,body,tags},{
                new:true
            }).exec()
            res.status(200).send({message:"Todo group is updated",todoGroup,success:true})
        } catch (error) {
            res.status(400).send({message:"Todo group failed to update", success:false, error})
        }
    })
    .delete(authenticate,async(req,res)=>{
        try {
            let userId = req.signData._id;
            let {_id} = req.body;
            await TodoGroup.deleteOne({_id})
            await Todo.deleteMany({todoGroupId:_id})
            res.status(200).send({message:"Todo group is deleted",success:true})
        } catch (error) {
            res.status(400).send({message:"Todo group failed to delete",success:false})
        }
    })

router.route('/new/todo')
    .post(authenticate,async(req,res)=>{
        try {
            let userId = req.signData._id;
            let {todoGroupId, title='', body='',tags=[]} = req.body;
            let newTodo = await Todo.create({userId,todoGroupId,title,body,tags})
            res.status(200).send({message:"Todo is created and added to todo group successfully",newTodo,success:true})
        } catch (error) {
            res.status(400).send({message:"Todo failed to be created or added to todo group",error,success:false})
        }
    })
    .delete(authenticate,async(req,res)=>{
        try {
            let userId = req.signData._id;
            let {_id,todoGroupId} = req.body;
            await Todo.deleteOne({_id,userId,todoGroupId})
            res.status(200).send({message:"Todo is removed successfully",success:true})
        } catch (error) {
            res.status(400).send({message:"Todo is removed successfully",success:false})
        }
    })


router.route('/existing/todo') /// still working here 
    .post(authenticate,async(req,res)=>{
        try {
            let userId = req.signData._id;
            let {todoGroupId,_id} = req.body;
            let todo = await Todo.findOne({todoGroupId,_id});
            res.status(200).send({message:"Todo is created and added to todo group successfully",todo,success:true})
        } catch (error) {
            res.status(400).send({message:"Todo failed to be created or added to todo group",error,success:false})
        }
    })
    .delete(authenticate,async(req,res)=>{
        try {
            let userId = req.signData._id;
            let {_id,todoGroupId} = req.body;
            await Todo.deleteOne({_id,userId,todoGroupId})
            res.status(200).send({message:"Todo is removed successfully",success:true})
        } catch (error) {
            res.status(400).send({message:"Todo is removed successfully",success:false})
        }
    })
module.exports = router;