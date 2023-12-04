const jwt = require("jsonwebtoken");
const User = require("../models/user");


const requestLogger = (request, response, next) => {
    console.log("METHOD: ", request.method);
    console.log("PATH: ", request.path);
    console.log("BODY: ", request.body);
    next();
}

const getTokenFrom = (req, res, next) => {
    const authorization = req.get("Authorization");

    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
		req.token = authorization.substring(7)
	}
	else {
		req.token = null;
	}
	next();
}

const userExtractor = async (req, res, next) => {
    if (!req.token) {
		return res.status(401).json({ error: "Token missing" });
	}

	const decodedToken = jwt.verify(req.token, process.env.SECRET);

	if (!decodedToken) {
		return response.status(401).json({ error: "Token invalid" });
	}

	const user = await User.findById(decodedToken.id);
	req.user = user; 

	next();
}

module.exports = {
    requestLogger,
    getTokenFrom, 
    userExtractor
}