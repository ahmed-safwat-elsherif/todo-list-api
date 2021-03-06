const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    todoGroupId: { type: Schema.Types.ObjectId, ref: 'TodoGroup' },
    title: {
        type: String,
        required: true,
        maxlength: 20,
    },
    inGroup:{
        type:Boolean,
        default: false
    },
    body: {
        type: String,
        default:'This is the body of todo',
        maxlength: 500,
    },
    tags: [{
        name:{
            type: String
        }
    }],
    status:{
        type:String,
        default:"in progress",
        enum:["in progress","canceled","done"]
    }
},
{ timestamps: { createdAt: 'createdAt' } })
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo
