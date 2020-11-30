const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title: title, url: url, techs: techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositorieIndex = repositories.findIndex(repository => repository.id === id);
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }
  const likes = repositories[repositorieIndex].likes;
  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };
  repositories[repositorieIndex] = repository;
  return response.json(repository);


});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repository => repository.id === id);
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }
  repositories.splice(repositorieIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repository => repository.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "repository not found" })
  }
  const title = repositories[repositorieIndex].title;
  const url = repositories[repositorieIndex].url;
  const techs = repositories[repositorieIndex].techs;
  const likes = repositories[repositorieIndex].likes + 1;
  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }
  repositories[repositorieIndex] = repository;
  return response.json({ likes: repository.likes });
});

module.exports = app;
