const projectRouter = require("express").Router();
const Project = require("../models/project");
const User = require("../models/user");
const Task = require("../models/task");


projectRouter.post("/", async (req, res) => {
    const body = req.body;

    const newProject = new Project({
        user: req.user._id,
        name: body.name,
        created: new Date().toDateString()
    });

    const savedProject = await newProject.save();

    const user = await User.findById(req.user.id);
    user.projects = user.projects.concat(savedProject._id);
    await User.findByIdAndUpdate(req.user.id, {projects: user.projects});

    res.status(200).send(savedProject);
});

projectRouter.get("/:id", async (req, res) => {
    const project = await Project.findOne({id: req.params.id, user: req.user.id})
                                 .populate("tasks", {name: 1, status: 1});

    if (project) {
        return res.json(project).end();
    }
    else {
        return res.json({error: "Project not found"}).status(404).end();
    }
})

projectRouter.put("/:id", async (req, res) => {
    const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        {name: req.body.newName},
        {new: true}
    );
    
    if (updatedProject) {
        return res.status(200).send({message: "Project name updated"}).end();
    }

    return res.status(401).send({error: "Unauthorized"}).end();
})

projectRouter.delete("/:id", async (req, res) => {
    const project = await Project.findById(req.params.id);
    const user = await User.findById(project.user);

    const updatedUserProjects = user.projects.filter((p) => {
        return p._id.toString() !== req.params.id;
    })

    await User.findByIdAndUpdate(project.user, {projects: updatedUserProjects});
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({project: req.params.id});

    return res.status(204).end();
})


module.exports = projectRouter;
