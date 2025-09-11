const express = require('express');
const router = express.Router();
const gamificationController = require("../controllers/gamificationController");
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /gamification/toggle-gamification:
 *   post:
 *     summary: Enable or disable gamification for the current user
 *     description: Allows the user to activate or deactivate the gamification system in their account.
 *     tags:
 *       - Gamification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Gamification toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 gamificationEnabled:
 *                   type: boolean
 *                   example: true
 *       "401":
 *         description: Unauthorized (invalid or missing JWT)
 *       "500":
 *         description: Internal server error
 */
router.post('/toggle-gamification', authMiddleware, gamificationController.toggleGamification);

/**
 * @swagger
 * /gamification/complete-task:
 *   post:
 *     summary: Complete a task and apply gamification rewards
 *     description: Updates XP, coins, streak, and progress when a user completes a task.
 *     tags:
 *       - Gamification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "64f8c7e5a1d2f001dcd34567"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *     responses:
 *       "200":
 *         description: Task completed and progress updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     level:
 *                       type: integer
 *                       example: 7
 *                     xp:
 *                       type: integer
 *                       example: 300
 *                     coins:
 *                       type: integer
 *                       example: 120
 *                     streak:
 *                       type: integer
 *                       example: 5
 *                     reborns:
 *                       type: integer
 *                       example: 0
 *       "400":
 *         description: Invalid input data
 *       "401":
 *         description: Unauthorized (invalid or missing JWT)
 *       "500":
 *         description: Internal server error
 */
router.post('/complete-task', authMiddleware, gamificationController.completeTaskController);

module.exports = router;