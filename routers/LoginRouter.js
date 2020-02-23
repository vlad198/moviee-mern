require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const AuthMiddleware = require('../middleware/AuthMiddleware');
const User = require('../models/User');

router.post('/',
    [
        check('email', 'Please provide an email').isEmail(),
        check('password', 'Password at least 6 characters long').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let = user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const payload = {
                user: {
                    _id: user._id
                }
            };

            jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: 36000
            },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: {
                            name: user.name,
                            email: user.email
                        }
                    });
                }
            );

        } catch (err) {
            res.status(500).send('Server error');
        }
    }
);

router.get('/',AuthMiddleware,async (req,res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch(err) {
        console.console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;