const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const user = users.find((user) => user.username === username);
  if (!user) {
    return response.status(404).send('User not found!');
  }

  request.user = user;

  return next()
}

app.post('/users', (request, response) => {

  const { name, username, todos } = request.body;
  const id = uuidv4();

  const usernameAlreadyExists = users.some((user) => user.username === username);

  if (usernameAlreadyExists) return response.status(400).json({ error: "Username already exists!" })

  const user = (
    {
      "id": id,
      "name": name,
      "username": username,
      "todos": []
    }
  );

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { deadline, title } = request.body;
  const id = uuidv4();

  const todo = (
    {
      "id": id, // precisa ser um uuid
      "title": title,
      "done": false,
      "deadline": new Date(deadline),
      "created_at": new Date()
    }
  );

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = user.todos.find((todo) => todo.id === id);
  if (!todo) return response.status(404).json({ error: "Todo not found!" });
  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  if (!todo) return response.status(404).json({ error: "Todo not found!" })

  todo.done = true;

  return response.status(201).send(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  if (!todo) return response.status(404).json({ error: "Todo not found!" })

  user.todos.splice((todo) => todo.id === id, 1);

  return response.status(204).json(user);
});

module.exports = app;