const loginRouter = require("express").Router()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../utils/config");


loginRouter.post("/", async (req, res) => {
    const body = req.body;

    const user = await User.findOne({email: body.email}).populate("projects", {name: 1, created: 1})

    const passwordCorrect = user === null 
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return res.status(401).send({error: "invalid user"});
    }

    const userForToken = {
        name: user.name,
        id: user
    };

    const token = jwt.sign(userForToken, config.SECRET);

    res.json({token: token, id: user.id, name: user.name, email: user.email, projects: user.projects});
})


module.exports = loginRouter;
