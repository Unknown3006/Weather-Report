const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password, preferredCity } = req.body;
            
            // Debug logging
            console.log('Received registration data:', {
                username,
                email,
                hasPassword: !!password,
                preferredCity
            });

            if (!username || username.trim() === '') {
                console.log('Username validation failed:', { received: username });
                return res.status(400).json({ error: 'Username is required' });
            }

            // Continue with registration...
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                password: hashedPassword,
                preferredCity
            });

            const savedUser = await user.save();
            console.log('User saved successfully:', savedUser._id);

            const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET);
            res.status(201).json({
                user: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                    preferredCity: savedUser.preferredCity
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
            const { username, password } = req.body;
            console.log('Login attempt for username:', username);

            // Find user by username instead of email
            const user = await User.findOne({ username });
            if (!user) {
                console.log('User not found:', username);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Password mismatch for user:', username);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
            console.log('Login successful for user:', username);

            res.json({
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    preferredCity: user.preferredCity
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(400).json({ error: error.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const resetToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            await user.save();

            // Create transporter for sending emails
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Password Reset Link',
                text: `You are receiving this because you (or someone else) requested a password reset.
                      Please click on the following link to reset your password: ${resetUrl}
                      If you did not request this, please ignore this email.`
            };

            await transporter.sendMail(mailOptions);
            res.json({ message: 'Password reset email sent' });

        } catch (error) {
            res.status(500).json({ error: 'Error sending reset email' });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;

            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    error: 'Password reset token is invalid or has expired'
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();
            res.json({ message: 'Password has been reset successfully' });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    resetPasswordDirect: async (req, res) => {
        try {
            const { username, email, newPassword } = req.body;

            // Find user by username and email
            const user = await User.findOne({ username, email });

            if (!user) {
                return res.status(404).json({ 
                    error: 'User not found',
                    redirect: 'signup'
                });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;

            await user.save();
            res.json({ message: 'Password has been reset successfully' });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = authController;