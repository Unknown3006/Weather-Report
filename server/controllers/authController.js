const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
    register: async (req, res) => {
        try {
            console.log('Registration attempt:', req.body.email);
            const { email, password, preferredCity } = req.body;
            
            if (!email || !password) {
                console.log('Missing required fields');
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log('User already exists:', email);
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email,
                password: hashedPassword,
                preferredCity
            });

            await user.save();
            console.log('User created:', email);

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
            res.status(201).json({
                user: {
                    id: user._id,
                    email: user.email,
                    preferredCity: user.preferredCity
                },
                token
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({ error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

            res.json({
                user: {
                    id: user._id,
                    email: user.email,
                    preferredCity: user.preferredCity
                },
                token
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = authController;