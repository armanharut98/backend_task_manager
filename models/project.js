const mongoose = require("mongoose");


const projectSchema = mongoose.Schema({
    user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
    name: {
        type: String,
        minLength: 1,
        maxLength: 25
    },
    tasks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Task'
		}
	],
    created: String
});

projectSchema.set("toJSON", {
    transfrom: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});


const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
