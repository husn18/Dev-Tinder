const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const User = require('../models/User');
const { validateSignup } = require('../utils/validators');


authRouter.post('/signup', async (req, res) => {
    const allowedFields = ['firstname', 'lastname', 'email', 'gender', 'password', 'phone', 'age', 'skills'];
    const receivedFields = Object.keys(req.body);
    const isValidOperation = receivedFields.every((field) => allowedFields.includes(field));
    try {
        validateSignup(req);
        const {firstname, lastname, email, gender, password, phone, age} = req.body;    
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
        if (!isValidOperation) {
            return res.status(400).json({
                message: 'Invalid fields in the request body'
            });
        }
        if (typeof req.body.skills === 'string') {
            req.body.skills = req.body.skills
                .split(',')
                .map((skill) => skill.trim())
                .filter(Boolean);
        }
        const user = new User({
            firstname,
            lastname,
            email,
            gender,
            password: req.body.password,
            phone,
        });
        await user.save();
        res.send('User signed up successfully!');
    } catch (err) {
        console.error('Error signing up user:', err);
        res.status(500).json({
            message: 'Error signing up user',
            error: err.message,
            code: err.code,
            errors: err.errors
        });
    }
});

authRouter.post('/login', async (req, res) => {    
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }   
        const isPasswordMatch = await user.toValidatePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        if(isPasswordMatch) {
            const token = await user.toJWT();
            // console.log('Generated JWT token:', token);
            res.cookie('token', token, { httpOnly: true });
        }
        res.send('User logged in successfully!');
    } catch (err) { 
        console.error('Error logging in user:', err);
        res.status(500).json({
            message: 'Error logging in user',
            error: err.message,
            code: err.code,
            errors: err.errors
        });
    }
});
authRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.send('User logged out successfully!');
});

module.exports = authRouter;