const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoGroupSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true,
        minLength: 10,
        maxlength: 20,
    },
    body: {
        type: String,
        default:'This is the body of todo group',
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
const TodoGroup = mongoose.model('TodoGroup', todoGroupSchema);

module.exports = TodoGroup
