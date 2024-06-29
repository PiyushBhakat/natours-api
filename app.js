const fs = require('fs');
const express = require('express');
const morgan = require('morgan'); // HTTP request logger middleware

// This will essentially attach several functions to the app "variable"
const app = express();
const port = 3000;

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
// We're doing this in the top-level code, because we only need to read the file once
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// (req, res) is known as the route handler
const getAllTours = (req, res) => {
    res.status(200).json({
        // Using the JSend specification
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
}

const getTour = (req, res) => {
    const id = req.params.id * 1; // Converting the value of id key (string) to a number, cool trick

    if (id > tours.length) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    } else {
    
        const tour = tours.find(el => el.id === id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    }
}

const deleteTour = (req, res) => {
   if (req.params.id > tours.length) {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
    });
   } else {
    res.status(204).json({
        status: 'success',
        message: 'Deleted the tour!',
        data: null
    });
   }
}

const updateTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours), // Converting the object into JSON so it can be stored into the file
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                }
            });
        }
    );
}

// We just refactored our code significantly
app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', updateTour);
app.get('/api/v1/tours/:id', getTour);
app.delete('/api/v1/tours/:id', deleteTour);

// Instead of having to define the endpoint each point for every route handler, we can also do this
app.route('/api/v1/tours').get(getAllTours).post(updateTour);
app.route('/api/v1/tours/:id').get(getTour).delete(deleteTour);

// Starting a server
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});


