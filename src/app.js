const dns = require('dns');
dns.setServers(['8.8.8.8']);
const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const connectDb = require('./config/database');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { validateSignup } = require('./utils/validators');

app.use(express.json());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {    
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }   
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
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
app.get('/getusers', async (req, res) => {
    try {
        const filter = req.query.email ? { email: req.query.email } : {};
        const users = await User.find(filter);
        res.json(users);
    }
    catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error fetching users');
    }
});

app.get('/fetchusers', async (req, res) => {
    try {
        const users = await User.find();
        // res.json(users);
        res.send(users);
    }
    catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error fetching users');
    }  
});

app.delete('/deleteusers', async (req, res) => {
    const userId = req.body.id;
    try {
        await User.findByIdAndDelete(userId,{
                runValidators: true
        });
        res.send('User deleted successfully!');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});

app.patch('/updateusers/:userId', async (req, res) => {
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
        const updatedUser = await User.findByIdAndUpdate(userId, updateData ,{
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

connectDb().then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

//  app.get('/', (req, res) => {
//      res.send('Welcome to De Tinder!');
//  });
//  app.get('/test', (req, res) => {
//      res.send('This is a test route for Dev Tinder!');
//  });
//  app.get('/hello', (req, res) => {
//      res.send('Hello, Dev Tinder!');
//  });
// app.get('/users', (req, res,next) => {
//     res.send('This is the users route 1 for Dev Tinder!');
//     next();
// } ,
//  (req, res ,next) => {    
//      next();
//     console.log('This is the second callback for the users route!');
//     res.send('This is the users route 2 for Dev Tinder!'); 
   
// } , (req, res,next) => {    
//     console.log('This is the third callback for the users route!');
//     next();
// }
// );
// const { adminRouter, userRouter } = require('./middlewares/adminRouter');
// app.use('/admin',adminRouter);
// app.get('/admin/login', adminRouter ,(req, res) => {
//     res.send('Welcome back Mrs. Admin, to Dev Tinder!');
// });
// app.use('/users', userRouter);
// app.get('/users/login', userRouter, (req, res) => {
//     res.send('Welcome back, to Dev Tinder!');
// });

// app.post('/users', (req, res) => {
//     res.send('This is the login route for Dev Tinder!');
// });
// app.delete('/users', (req, res) => {
//     res.send('This is the logout route for Dev Tinder!');
// });
// app.use('/users', (req, res) => {
//     res.send('This is the users route for Dev Tinder!');
// }   );
// app.use('/', (err,req, res,next) => {
//     if(err) {
//         console.error(err);
//         res.status(404).send('Route not found. Please check the URL and try again.');
//     }
// });