const express = require("express");

const server = express();

// para o express entender que no corpo da requisição vem JSON
server.use(express.json());

const projects = [];
let requests = 0;

// contador de requisições.
server.use("/", (req, res, next) => {
  requests++;
  console.log(`Number of requests = ${requests}`);
  next();
});

function checkIdProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(proj => proj.id === id);

  if (!project) {
    return res.status(400).json({ error: `Project '${id}' not found! ` });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const newProject = {
    id,
    title,
    tasks: []
  };

  projects.push(newProject);

  return res.json(projects);
});

server.put("/projects/:id", checkIdProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id === id);

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id/", checkIdProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.findIndex(proj => proj.id === id);

  projects.splice(project, 1);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkIdProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const newTasks = projects.find(proj => proj.id === id);

  newTasks.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
