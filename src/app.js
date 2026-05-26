const dns = require('dns');
dns.setServers(['8.8.8.8']);
const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const connectDb = require('./config/database');

app.use(express.json());

app.listen(3000, () => {
        console.log('Server is running on port 3000');
    }); 
app.use(express.json());
app.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send('User signed up successfully!');
    } catch (err) {
        console.error('Error signing up user:', err);
        res.status(500).send('Error signing up user');
    }
});

connectDb().then(() => {
    console.log('Connected to MongoDB');
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