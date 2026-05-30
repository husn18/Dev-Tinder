const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post('/sendconnectionrequest', userAuth, async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }
        if (receiver.connectionRequests.includes(senderId)) {
            return res.status(400).json({ message: 'Connection request already sent' });
        }
        receiver.connectionRequests.push(senderId);
        await receiver.save();
        res.send('Connection request sent successfully!');
    } catch (err) {
        console.error('Error sending connection request:', err);
        res.status(500).json({ message: 'Error sending connection request' });
    }
});
module.exports = requestRouter;