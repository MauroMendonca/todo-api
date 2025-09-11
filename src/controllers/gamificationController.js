const User = require('../models/User');
//import User, { findOne } from '../models/User';
//import User from '../models/User.js';

const gamificationService = require("../services/gamificationService");

// [POST] toggle-gamification
const toggleGamification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.gamification = !user.gamification;

        await user.save();

        return res.status(200).json({
            success: true,
            gamification: user.gamification,
            message: `Gamification has been ${user.gamification ? "enabled" : "disabled"}.`
        });

    } catch (error) {
        console.error("Error toggling gamification:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// [POST] Complet task method
const completeTaskController = async (req, res) => {
    const { taskPriority, xpMultiplier, coinsMultiplier } = req.body;
    const userId = req.user.id;

    const updatedUser = await gamificationService.completeTask(
        userId,
        taskPriority,
        xpMultiplier,
        coinsMultiplier
    );

    res.json(updatedUser);
}

module.exports = { 
    toggleGamification,
    completeTaskController
};