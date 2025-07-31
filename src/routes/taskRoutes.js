const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, taskController.getAllTasks);
router.post('/', authMiddleware,taskController.createTask);
router.post('/bulk', authMiddleware,taskController.createBulkTasks);
router.patch('/:id', authMiddleware, taskController.updateTask);
router.put('/:id', authMiddleware, taskController.replaceTask);
router.delete('/clear', authMiddleware, taskController.clearTasks);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;