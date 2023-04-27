const mongoose = require('mongoose')

const userTodoSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    task:{
            type:String,
            required:true
        },
    image: {
        type: String || File || Object,
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true })




const userTodo = mongoose.model("UserTodo", userTodoSchema)
module.exports = userTodo