require('dotenv').config();

const jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
    }
}

module.exports = AuthMiddleware;