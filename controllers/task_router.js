const taskRouter = require("express").Router();
const Task = require("../models/task");
const Project = require("../models/project");


taskRouter.post("/", async (req, res) => {
    const body = req.body;
    console.log("body -> ", req.body)
    console.log("user -> ", req.user)

    const newTask = new Task({
        user: req.user._id,
        name: body.name,
        project: body.project,
        description: body.description,
        status: body.status,
        created: new Date().toDateString()
    });

    const savedTask = await newTask.save();

    const project = await Project.findById(body.project);
    project.tasks = project.tasks.concat(savedTask._id);
    await Project.findByIdAndUpdate(body.project, { tasks: project.tasks })

    return res.send(savedTask).status(200).end();
})

taskRouter.get("/:id", async (req, res) => {
    const task = await Task.findById(req.params.id)
                           .populate('user', {name: 1})
                           .populate('project', {name: 1});

    if (task) {
        return res.send(task).status(200).end();
    }

    return res.send({ error: "Task not found" }).status(404).end();
})

taskRouter.put("/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true})

    if (updatedTask) {
        return res.send(updatedTask).status(200).end()
    }

    return res.json({ error: "Unauthorized" }).status(401).end();
});

taskRouter.delete("/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
        const project = await Project.findById(task.project);
 
        const updatedTaskList = project.tasks.filter((t) => {
            return t._id.toString() !== req.params.id
        })
 
        await Project.findByIdAndUpdate(task.project, {tasks: updatedTaskList});
 
        await Task.findOneAndDelete(req.params.id);
 
        return res.status(200).end();
    }
    return res.send({message: "Task not found"});
})


module.exports = taskRouter;
