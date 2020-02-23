require('dotenv').config();
const router = require('express').Router();
const { check, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/',
    [
        check('name', 'Please provide a name').not().isEmpty(),
        check('email', 'Please provide an email').isEmail(),
        check('password', 'Password at least 6 characters long').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({
                name,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

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
            res.status(500).send('server error');
        }
    }
);

module.exports = router;



