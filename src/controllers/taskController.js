const tasks = require('../models/taskModel');

// Listar tarefas
const getAllTasks = (req, res) => {
  res.json(tasks);
};

// Criar nova tarefa
const createTask = (req, res) => {
  const { title, priority = 'média', tags = [], date } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'O título é obrigatório.' });
  }

  if (date && isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'Formato de data inválido.' });
  }

  const newTask = {
    id: Date.now(),
    title,
    priority,
    tags,
    date: date ? new Date(date) : null,
    done: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

// Atualizar tarefa
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, done, priority, tags, date } = req.body;
  const task = tasks.find(t => t.id == id);

  if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });

  if (title) task.title = title;
  if (typeof done === 'boolean') task.done = done;
  if (priority) task.priority = priority;
  if (tags) task.tags = tags;
  if (date) {
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'Formato de data inválido.' });
    }
    task.date = new Date(date);
  }

  res.json(task);
};

// Deletar tarefa
const deleteTask = (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id == id);

  if (index === -1) {
    return res.status(404).json({ message: 'Tarefa não encontrada.' });
  }

  tasks.splice(index, 1);
  res.status(204).send();
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
};