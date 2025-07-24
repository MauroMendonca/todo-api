const Task = require('../models/Task');

// [GET] Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const { tags, priority, date } = req.query;

    const filter = {userId: req.user._id};

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagsArray };
    }

    if (priority) {
      filter.priority = priority;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      filter.date = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const tasks = await Task.find(filter);

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [POST] Create a new task
const createTask = async (req, res) => {
  try {
    const { title, priority, tags = [], date, userId} = req.body;
    const task = new Task({
      title,
      priority,
      tags,
      date: date ? new Date(date) : null,
      userId,
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [PUT] Update a task
const updateTask = async (req, res) => {
  try {
    const { title, done, priority, tags, date } = req.body;
    const update = {};

    if (title) update.title = title;
    if (typeof done === 'boolean') update.done = done;
    if (priority) update.priority = priority;
    if (tags) update.tags = tags;
    if (date) update.date = new Date(date);

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, update, { new: true });

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [DELETE] Delete a task
const deleteTask = async (req, res) => {
  const result = await Task.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: 'Task not found.' });
  res.status(204).send();
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};