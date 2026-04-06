const Task = require('../models/Task');

// [GET] Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const { tags, priority, title, description, starDate, endDate, done, important, page = 1, limit, sort = 'date', order = 'desc' } = req.query;

    const filter = { userId: req.user._id };

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagsArray };
    }

    if (priority) filter.priority = priority;
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (description) filter.description = { $regex: description, $options: 'i' };
    if (done !== undefined) filter.done = done === 'true';
    if (important !== undefined) filter.important = important === 'true';

    if (starDate || endDate) {
      filter.date = {};
      if (starDate) filter.date.$gte = new Date(starDate);
      if (endDate) filter.date.$lt = new Date(endDate);
    }

    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.aggregate([
      { $match: filter },
      { $addFields: { 
        _hasNoDtate: { $cond: [{ $ifNull: ['$date', false] }, 0, 1] } 
        }  
      },
      { $sort: { 
        _hasNoDtate: 1,
        [sort]: sortOrder } },
      { $skip: (Number(page) - 1) * (Number(limit) || 0) },
      ...(limit ? [{ $limit: Number(limit) }] : []),
      { $unset: '_hasNoDtate' } 
    ]);

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [GET] Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not yours.' });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// [POST] Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, important, tags = [], date, userId, parentTask } = req.body;
    
    if (parentTask) {
      const parent = await Task.findOne({ _id: parentTask, userId });
      if (!parent) return res.status(400).json({ message: 'Parent task not found or not yours.' });
    }

    const task = new Task({
      title,
      description,
      priority,
      important: important || false,
      tags,
      date: date ? new Date(date) : null,
      userId,
      parentTask: parentTask || null
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// [GET] Get subtasks of a task
const getSubtasks = async (req, res) => {
  try {
    const subtasks = await Task.find({ 
      parentTask: req.params.id, 
      userId: req.user._id
    });
    res.status(200).json(subtasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] GetTaskTree
const getTaskTree = async (req, res) => {
  try {
    const root = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!root) return res.status(404).json({ message: 'Task not found or not yours.' });

    const tree = await buildTree(root, req.user._id);
    res.status(200).json(tree);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PATCH] Update a task
const updateTask = async (req, res) => {
  try {
    const { title, description, done, priority, important, tags, date } = req.body;
    const update = {};

    if (title) update.title = title;
    if (description) update.description = description;
    if (typeof done === 'boolean') update.done = done;
    if (priority) update.priority = priority;
    if (typeof important === 'boolean') update.important = important;
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
    const { title, done, priority, important, tags, date } = req.body;

    if (title) newTask.title = title;
    if (description) newTask.description = description;
    if (typeof done === 'boolean') newTask.done = done;
    if (priority) newTask.priority = priority;
    if (typeof important === 'boolean') newTask.important = important;
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

// [PATCH] Toggle complete status
const toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours.' });

    task.done = !task.done;
    const saved = await task.save();

    return res.status(200).json(saved);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//[PATCH] Toggle important status
const toggleImportant = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours.' });

    task.important = !task.important;
    const saved = await task.save();

    return res.status(200).json(saved);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
};

// [DELETE] Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours.' });
    
    await deletTaskRecursive(req.params.id, req.user._id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

// [GET] Get task stats
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const total = await Task.countDocuments({ userId });
    const pending = await Task.countDocuments({ userId, done: false });
    const completed = await Task.countDocuments({ userId, done: true });
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const completedToday = await Task.countDocuments({
      userId,
      done: true,
      date: { $gte: startOfDay },
    });
    const now = new Date();
    const overdue = await Task.countDocuments({
      userId,
      done: false,
      date: { $lt: now },
    });

    res.json({ total, pending, completed, completedToday, overdue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function deletTaskRecursive(taskId, userId) {
  const children = await Task.find({ parentTask: taskId, userId });
  for (const child of children) {
    await deletTaskRecursive(child._id, userId);
  }
  await Task.findByIdAndDelete(taskId);
}

async function buildTree(task, userId) {
  const children = await Task.find({ parentTask: task._id, userId });
  const childTrees = await Promise.all(children.map(c => buildTree(c, userId)));
  return { ...task.toObject(), subtasks: childTrees };
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  replaceTask,
  updateTask,
  toggleComplete,
  toggleImportant,
  deleteTask,
  createBulkTasks,
  clearTasks,
  getTaskStats,
  getSubtasks,
  getTaskTree
};