const User = require("../models/User");

function xpForNextLevel(level) {
    const base = 100;
    const exponent = 1.5;
    return Math.floor(base * Math.pow(level, exponent));
}

async function completeTask(userId, taskPriority, taskXpMultiplier, taskCoinsMultiplier) {
    const user = await User.findById(userId);

    let xpGain = Number(taskXpMultiplier) || 0;
    let coinsGain = Number(taskCoinsMultiplier) || 0;

    if (user.boostXP && user.boostXP.expiresAt > new Date()) {
        xpGain *= Number(user.boostXP.multiplier) || 1;
    }

    user.xp += xpGain;
    user.coins += coinsGain;

    const lastTaskDate = user.gamificationHistory
        .filter(h => h.type === 'xp')
        .sort((a, b) => b.date - a.date)[0]?.date;

    user.streak = updateStreak(lastTaskDate, user.streak);

    while (user.xp >= xpForNextLevel(user.level) && user.level < 100) {
        user.xp -= xpForNextLevel(user.level);
        user.level += 1;
    }

    user.gamificationHistory.push({
        type: 'xp',
        value: xpGain,
        description: `XP ganho por tarefa prioridade ${taskPriority}`,
    });
    user.gamificationHistory.push({
        type: 'coins',
        value: coinsGain,
        description: `Coins ganho por tarefa prioridade ${taskPriority}`,
    });

    await user.save();
    return user;
}

function updateStreak(lastDate, currentStreak) {
    const today = new Date();

    if (!lastDate) {
        return 0;
    }

    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dateLast = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

    const diffMs = todayDate - dateLast;
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    let newStreak;

    if (diffDias === 1) {
        newStreak = currentStreak + 1;
    } else if (diffDias > 1) {
        currentStreak = 1;
    } else {
        newStreak = currentStreak;
    }

    return newStreak;
}

module.exports = { xpForNextLevel, completeTask, updateStreak };