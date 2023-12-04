const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./controllers/user_router");
const taskRouter = require("./controllers/task_router");
const loginRouter = require("./controllers/login_router");
const projectRouter = require("./controllers/project_router");
const config = require("./utils/config");
const middleware = require("./utils/middleware");


console.log("Connecting to ", config.MONGO_URI);

mongoose.connect(config.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((error) => {
        console.log(`Error connecting to DB ${error.message}`);
    })

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/projects", middleware.getTokenFrom, middleware.userExtractor, projectRouter);
app.use("/api/tasks", middleware.getTokenFrom, middleware.userExtractor, taskRouter);
app.get("/api", async (req, res) => {
    res.status(200).end()
})


module.exports = app;
