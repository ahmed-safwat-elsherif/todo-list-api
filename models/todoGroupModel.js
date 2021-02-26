const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoGroupSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 20,
    },
    body: {
        type: String,
        default:'This is the body of todo group',
        minlength: 10,
        maxlength: 500,
    },
    tags: [{
        type: String,
        maxlength: 10
    }],
    status:{
        type:String,
        default:"in progress",
        enum:["in progress","canceled","done"]
    }
},
{ timestamps: { createdAt: 'createdAt' } })
const TodoGroup = mongoose.model('TodoGroup', todoGroupSchema);

module.exports = TodoGroup
