const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// ⚠️ IMPORTANTE: rotas estáticas (bulk, clear, stats, toggle, toggle-important)
// devem vir ANTES das rotas dinâmicas (/:id) para evitar conflitos de parâmetros.

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks with optional filters, pagination and sorting
 *     description: Returns only root tasks (parentTask = null) by default. Use the parentTask query param to fetch subtasks of a specific task.
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
 *         description: Filter tasks from this date (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks up to this date (exclusive)
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
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, priority, title]
 *           default: date
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sorting order. Tasks without a date always appear last.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of tasks per page. Omit to return all tasks.
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, taskController.getAllTasks);

/**
 * @swagger
 * /tasks/bulk:
 *   post:
 *     summary: Create multiple tasks at once
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tasks
 *             properties:
 *               tasks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Tasks created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "3 tasks created successfully."
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/bulk', authMiddleware, taskController.createBulkTasks);

/**
 * @swagger
 * /tasks/clear:
 *   delete:
 *     summary: Delete all tasks of the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All tasks deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "42 tasks cleared successfully."
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/clear', authMiddleware, taskController.clearTasks);

/**
 * @swagger
 * /tasks/stats:
 *   get:
 *     summary: Get task statistics for the logged-in user
 *     description: Returns total, pending, completed, completedToday and overdue task counts.
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
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/stats', authMiddleware, taskController.getTaskStats);

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
 *         description: Completion status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found or not yours
 *       500:
 *         description: Internal server error
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
 *         description: Important status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found or not yours
 *       500:
 *         description: Internal server error
 */
router.patch('/toggle-important/:id', authMiddleware, taskController.toggleImportant);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task or subtask
 *     description: >
 *       Creates a new task. To create a subtask, pass the `parentTask` field with
 *       the ID of the parent task. Subtasks can themselves have subtasks, allowing
 *       unlimited nesting levels.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Parent task not found or not yours
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, taskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
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
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found or not yours
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, taskController.getTaskById);

/**
 * @swagger
 * /tasks/{id}/subtasks:
 *   get:
 *     summary: Get direct subtasks of a task
 *     description: Returns only the immediate children (depth = 1) of the given task. To get all levels at once, use GET /tasks/{id}/tree.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent task ID
 *     responses:
 *       200:
 *         description: List of direct subtasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Parent task not found or not yours
 *       500:
 *         description: Internal server error
 */
router.get('/:id/subtasks', authMiddleware, taskController.getSubtasks);

/**
 * @swagger
 * /tasks/{id}/tree:
 *   get:
 *     summary: Get a task with all its descendants as a nested tree
 *     description: >
 *       Returns the task and recursively all its subtasks nested under a `subtasks`
 *       array. Each subtask also contains its own `subtasks` array, allowing
 *       unlimited depth. Use this endpoint to render a full task hierarchy.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Root task ID
 *     responses:
 *       200:
 *         description: Task tree retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskTree'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found or not yours
 *       500:
 *         description: Internal server error
 */
router.get('/:id/tree', authMiddleware, taskController.getTaskTree);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Partially update a task by ID
 *     description: Only the fields provided in the request body will be updated.
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
 *             $ref: '#/components/schemas/TaskInput'
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
 *         description: Task not found or not yours
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authMiddleware, taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Replace a task by ID
 *     description: Replaces the entire task document. All fields must be provided.
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
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Task replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found or not yours
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, taskController.replaceTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task and all its descendants
 *     description: >
 *       Permanently deletes the task identified by `id` and **all subtasks recursively**,
 *       regardless of nesting depth. This action cannot be undone.
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
 *         description: Task and all descendants deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found or not yours
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
