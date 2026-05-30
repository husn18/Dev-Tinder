const express = require('express');
const profileRouter = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { userAuth, validateUpdateProfile, validateForgotPassword } = require('../middlewares/userAuth');
const User = require('../models/user');

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

profileRouter.delete('/deleteProfile', userAuth, async (req, res) => {
    try {
        const userId = req.userId;
        await User.findByIdAndDelete(userId);
        res.send('User profile deleted successfully!');
    } catch (err) {
        console.error('Error deleting user profile:', err);
        res.status(500).json({ message: 'Error deleting user profile' });
    }
});


// profileRouter.patch('/updateusers/:userId', userAuth, async (req, res) => {
//     const allowedFields = ['firstname', 'lastname', 'email', 'phone', 'age', 'gender', 'password', 'skills'];
//     const receivedFields = Object.keys(req.body);
//     const isValidOperation = receivedFields.every((field) => allowedFields.includes(field));
//     const userId = req.params.userId;
//     const updateData = req.body;
//     try {
//         if (!isValidOperation) {
//             return res.status(400).json({
//                 message: 'Invalid fields in the request body'
//             });
//         }
//         const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
//             new: true,
//             runValidators: true
//         });
//         res.send('User updated successfully!');
//         console.log(updatedUser);
//     }   
//     catch (err) {
//         console.error('Error updating user:', err); 
//         res.status(500).send('Error updating user');
//     }
// });
profileRouter.patch('/updateProfile', userAuth, async (req, res) => {
    validateUpdateProfile(req);
    try {
        const userId = req.userId;
        const updateData = req.body;
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
profileRouter.patch('/forgotPassword', async (req, res) => {
    const { email, newPassword } = req.body;
    validateForgotPassword(req);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.send('Password updated successfully!');
    }
    catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Error updating password' });
    }
});

module.exports = profileRouter;