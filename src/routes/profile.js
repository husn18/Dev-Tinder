const express = require('express');
const profileRouter = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('../middlewares/userAuth');
const User = require('../models/User');

profileRouter.get('/profile',userAuth, async (req, res) => {
    try{
        const userId = req.userId;
        const user = await User.findById(userId);
        res.json({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,  
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

profileRouter.delete('/deleteusers', userAuth, async (req, res) => {
    const userId = req.body.id;
    try {
        await User.findByIdAndDelete(userId, {
            runValidators: true
        });
        res.send('User deleted successfully!');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});

profileRouter.patch('/updateusers/:userId', userAuth, async (req, res) => {
    const allowedFields = ['firstname', 'lastname', 'email', 'phone', 'age', 'gender', 'password', 'skills'];
    const receivedFields = Object.keys(req.body);
    const isValidOperation = receivedFields.every((field) => allowedFields.includes(field));
    const userId = req.params.userId;
    const updateData = req.body;
    try {
        if (!isValidOperation) {
            return res.status(400).json({
                message: 'Invalid fields in the request body'
            });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        });
        res.send('User updated successfully!');
        console.log(updatedUser);
    }   
    catch (err) {
        console.error('Error updating user:', err); 
        res.status(500).send('Error updating user');
    }
});
module.exports = profileRouter;