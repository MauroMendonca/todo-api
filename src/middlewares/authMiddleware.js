const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'Token not provided.'});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if(!user) return res.status(401).json({message: 'User not found.'});

        req.user = user;
        next();
    } catch(error){
        return res.status(401).json({message: 'Invalid token.', error: error.message}); 
    }
};

module.exports = authMiddleware;