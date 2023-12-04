const mongoose = require("mongoose");


const taskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    name: {
        type: String,
        minLength: 1,
        maxLength: 25,
    },
    description: {
        type: String,
        maxLength: 420 
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        required: true
    },
    created: Date
});

taskSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
