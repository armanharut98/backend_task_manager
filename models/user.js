const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const userSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        required: true
    },
    email: {
        type: String,
        minLength: 6,
        required: true,
        unique: true
    },
    passwordHash: String,
    projects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project'
		}
	]
});

userSchema.set("toJSON", {
    transfrom: function(document, returnedObject) {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
})

userSchema.plugin(uniqueValidator);


const User = mongoose.model("User", userSchema);
module.exports = User;
