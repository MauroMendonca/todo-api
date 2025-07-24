const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// [POST] Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered.' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const userData = user.toObject();
        delete userData.password;

        res.status(201).json({ message: 'User registered successfully.', user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [POST] Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [GET] Get logged-in user details
const getUserDetails = async (req, res) => {
    if(!req.user) return res.status(500).json({ message: 'Unauthorized' });

    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getUserDetails
};