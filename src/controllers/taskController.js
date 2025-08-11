const Task = require('../models/Task');

// [GET] Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const { tags, priority, title, starDate, endDate, done, page = 1, limit, sort = 'date', order = 'desc' } = req.query;

    const filter = {userId: req.user._id};

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagsArray };
    }

    if (priority) {
      filter.priority = priority;
    }

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (done !== undefined) {
      filter.done = done === 'true';
    }

    if  (starDate || endDate) {
      filter.date = {};
      if (starDate) {
        filter.date.$gte = new Date(starDate);
      }
      if (endDate) {
        filter.date.$lt = new Date(endDate);
      }
    }

    const tasks = await Task.find(filter)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

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

// [PATCH] Update a task
const updateTask = async (req, res) => {
  try {
    const { title, done, priority, tags, date } = req.body;
    const update = {};

    if (title) update.title = title;
    if (typeof done === 'boolean') update.done = done;
    if (priority) update.priority = priority;
    if (tags) update.tags = tags;
    if (date) update.date = new Date(date);

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      update,
      { new: true, runValidators: true }
    );

    if (!updatedTask) return res.status(404).json({ message: 'Task not found or not yours.' });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] Replace a task
const replaceTask = async (req, res) => {
  try {
    const newTask = req.body;
    const { title, done, priority, tags, date } = req.body;

    if (title) newTask.title = title;
    if (typeof done === 'boolean') newTask.done = done;
    if (priority) newTask.priority = priority;
    if (tags) newTask.tags = tags;
    if (date) newTask.date = new Date(date);

    const replacedTask = await Task.findOneAndReplace(
      { _id: req.params.id, userId: req.user._id },
      newTask,
      { new: true, runValidators: true }
    );

    if (!replacedTask) return res.status(404).json({ message: 'Task not found or not yours.' });

    res.json(replacedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

// [DELETE] Delete a task
const deleteTask = async (req, res) => {
  const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id } );
  if (!result) return res.status(404).json({ message: 'Task not found or not yours.' });
  res.status(204).send();
};

// [POST] Create multiple tasks
const createBulkTasks = async (req, res) => {
  try {
    const tasksData = req.body.tasks;
    const userId = req.user._id;

    if (!Array.isArray(tasksData) || tasksData.length === 0) return res.status(400).json({ message: 'Invalid tasks data.' });

    const tasksToInsert = tasksData.map(task => ({
      ...task,
      userId
    }));

    const createdTasks = await Task.insertMany(tasksToInsert, { ordered: false });

    return res.status(201).json({
      message: `${createdTasks.length} tasks created successfully.`,
      tasks: createdTasks
    });
  } catch (error) {
    console.error('Error creating bulk tasks:', error);
    
    if (error.name === 'ValidationError' || error.name === 'BulkWriteError') {
      return res.status(400).json({ error: 'Some tasks could not be created due to validation errors.', details: error.message });
    }

    return res.status(500).json({ error: 'An error occurred while creating tasks.', details: error.message });
  }
}

// [DELETE] Clear all tasks
const clearTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Task.deleteMany({ userId });

    return res.status(200).json({
      message: `${result.deletedCount} tasks cleared successfully.`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  replaceTask,
  updateTask,
  deleteTask,
  createBulkTasks,
  clearTasks
};