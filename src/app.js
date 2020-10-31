const express = require("express");
const {uuid, isUuid} = require('uuidv4');
const cors = require("cors");

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());


function validateProjetcId(request, response, next){
  const { id } = request.params
  if(!isUuid(id)){
      return response.status(400).json({ error: 'Invalid project ID.' })
  }
  return next()
}


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post('/repositories', (request, response) => {
  // const body = request.body;
  // console.log(body)

  const {title, url, techs} = request.body

  const repositorie = {id:uuid(), title, url, techs, likes: 0}
  repositories.push(repositorie)

  return response.json(repositories)
})

app.post('/repositories/:id/like', (request, response) => {

  const {id} = request.params

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)
  if(repositorieIndex < 0){
      return response.status(400).json({
          error:"Repositório não encontrado."
      })
  }

  repositories[repositorieIndex].likes++

  return response.json(repositories[repositorieIndex])
})

app.put('/repositories/:id', validateProjetcId, (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)
  if(repositorieIndex < 0){
      return response.status(400).json({
          error: "Repositório não encontrado."
      })
  }

  const repositorie = {
      id,
      title,
      url,
      techs,
      likes: repositories[repositorieIndex].likes
  }

  repositories[repositorieIndex] = repositorie

  return response.json(repositorie)
})

app.delete('/repositories/:id', validateProjetcId, (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)
  if(repositorieIndex < 0){
      return response.status(400).json({
          error: "Repositório não encontrado."
      })
  }

  repositories.splice(repositorieIndex,1)

  //status 204 pq esta retornando em branco
  return response.status(204).send()
})

module.exports = app;
