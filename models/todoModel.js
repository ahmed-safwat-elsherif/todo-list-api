const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true,
        minLength: 10,
        maxlength: 20,
    },
    body: {
        type: String,
        required: true,
        minLength: 10,
        maxlength: 500,
    },
    tags: [{
        type: String,
        maxlength: 10
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{ strict: true })
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo
