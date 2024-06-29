// This file is actually used for all the middleware
const express = require('express');
const morgan = require('morgan'); // HTTP request logger middleware
const tourRouter = require('./routes/tourRoutes');

// This will essentially attach several functions to the app "variable"
const app = express();

// We use app.use to include middleware, which is basically a function to modify the incoming request
// By using this middleware, the request which is in JSON is converted into an object, and then attached
// to the req.body property of the request object, making it accessible to route handlers
app.use(express.json());
app.use(morgan('dev'));

// Routing - How an application responds to client requests to specific endpoints and HTTP methods
// app.get('/', (req, res) => {
    // Automatically sets the Content-Type header
    // res.send("This is the response in HTML!");
    // We can only send one type of content at a time (the Content-Type header can only be set once)
    // res.json({ message: "This is the response in JSON!" });
// });

// Creating our own middleware (remember that the order matters a lot)
app.use((req, res, next) => {
    console.log("Hello from the middleware!");
    // It's import to call next() otherwise the request-response cycle won't actually get completed
    next();
});

// Let's do something that's actually useful with middlewares
app.use((req, res, next) => {
    // With this, we're basically adding a new property on the request object that specifies the 
    // time when the request is called
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next();
});

// Reading our files (__dirname is the current folder where the script is located)

// The tourRouter is mounted on the 'api/v1/tours' route, hence it's called mounting
app.use('/api/v1/tours', tourRouter); // This is the middleware router

// Better to separate app and server 
module.exports = app;


