const express = require('express');
 const app = express();

 app.listen(3000, () => {
     console.log('Server is running on port 3000');
 });

//  app.get('/', (req, res) => {
//      res.send('Welcome to Dev Tinder!');
//  });
//  app.get('/test', (req, res) => {
//      res.send('This is a test route for Dev Tinder!');
//  });
//  app.get('/hello', (req, res) => {
//      res.send('Hello, Dev Tinder!');
//  });
app.get('/users', (req, res) => {
    res.send('This is the users route for Dev Tinder!');
});

app.post('/users', (req, res) => {
    res.send('This is the login route for Dev Tinder!');
});
app.delete('/users', (req, res) => {
    res.send('This is the logout route for Dev Tinder!');
});
app.use('/users', (req, res) => {
    res.send('This is the users route for Dev Tinder!');
}   );

