const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    admin: { type: Boolean, default: false },
    gamification: { type: Boolean, default: false },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    reborns: { type: Number, default: 0 },

    activeQuests: [
        {
            title: String,
            description: String,
            type: { type: String, enum: ['daily', 'weekly'] },
            target: Number,
            progress: { type: Number, default: 0 },
            xpReward: Number,
            coinsReward: Number,
            weight: Number,
            expiresAt: Date
        }
    ],

    badges: [
        {
            title: String,
            description: String,
            rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'] },
            achievedAt: Date
        }
    ],

    titles: [
        {
            title: String,
            description: String,
            achievedAt: Date
        }
    ],

    boostXP: {
        multiplier: { type: Number, default: 1 },
        expiresAt: Date
    },

    gamificationHistory: [
        {
            type: { type: String, enum: ['xp', 'coins', 'quest', 'badge', 'title', 'reborn'] },
            value: Number,
            description: String,
            date: { type: Date, default: Date.now }
        }
    ]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hashSync(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);