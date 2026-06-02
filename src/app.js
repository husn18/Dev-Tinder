const dns = require('dns');
dns.setServers(['8.8.8.8']);
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userAuth = require('./middlewares/userAuth');
const userRouter = require('./routes/user');

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

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