const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");


userRouter.post("/", async (req, res) => {
    const body = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const newUser = new User({
		name: body.name,
		email: body.email,
		passwordHash,
	})

    const savedUser = await newUser.save();
    res.json(savedUser);
})


module.exports = userRouter;
