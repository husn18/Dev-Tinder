const express = require('express');
const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
    const auth = req.auth || null;
    const isAdmin = auth && auth.isAdmin;
    if (!isAdmin) {
        return res.status(403).send('Access denied. Admins only.');
    }
    res.send('This is the admin route for Dev Tinder!');
});

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    const auth = req.auth || null;
    const isUser = auth && auth.isUser; 
    if (!isUser) {
        return res.status(403).send('Access denied. Users only.');
    }
    res.send('This is the users route for Dev Tinder!');
});

module.exports = { adminRouter, userRouter };