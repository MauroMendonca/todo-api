const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks with optional filters, pagination and sorting
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter tasks by title (partial match)
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter tasks by description (partial match)
 *       - in: query
 *         name: starDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks created from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks created up to this date
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter tasks by one or more tags
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter tasks by priority
 *       - in: query
 *         name: done
 *         schema:
 *           type: boolean
 *         description: Filter tasks by completion status
 *       - in: query
 *         name: important
 *         schema:
 *           type: boolean
 *         description: Filter tasks by importance status 
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting order (ascending or descending)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of tasks per page
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of tasks matching the query
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of items per page
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, taskController.getAllTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', authMiddleware,taskController.createTask);

/**
 * @swagger
 * /tasks/bulk:
 *   post:
 *     summary: Create multiple tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/tasksArray'
 *     responses:
 *       201:
 *         description: Tasks created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/bulk', authMiddleware,taskController.createBulkTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update part of a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.patch('/:id', authMiddleware, taskController.updateTask);
/**
 * @swagger
 * /tasks/toggle/{id}:
 *   patch:
 *     summary: Toggle a task's completion status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.patch('/toggle/:id', authMiddleware, taskController.toggleComplete);

/**
 * @swagger
 * /tasks/toggle-important/{id}:
 *   patch:
 *     summary: Toggle a task's important status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.patch('/toggle-important/:id', authMiddleware, taskController.toggleImportant);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Replace a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task replaced successfully
 */
router.put('/:id', authMiddleware, taskController.replaceTask);

/**
 * @swagger
 * /tasks/clear:
 *   delete:
 *     summary: Delete all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All tasks deleted successfully
 */
router.delete('/clear', authMiddleware, taskController.clearTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 */
router.delete('/:id', authMiddleware, taskController.deleteTask);

/**
 * @swagger
 * /tasks/stats:
 *   get:
 *     summary: Get task statistics for the logged-in user
 *     description: Returns statistics including total tasks, pending tasks, completed tasks, tasks completed today, and overdue tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 pending:
 *                   type: integer
 *                   example: 10
 *                 completed:
 *                   type: integer
 *                   example: 25
 *                 completedToday:
 *                   type: integer
 *                   example: 5
 *                 overdue:
 *                   type: integer
 *                   example: 2
 *       401:
 *         description: Unauthorized - user not logged in
 *       500:
 *         description: Server error
 */
router.get("/stats", authMiddleware, taskController.getTaskStats);

module.exports = router;