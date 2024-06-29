const fs = require('fs');

// Since we have multple things to export here, we're doing it on exports object
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// The param middleware function
exports.checkId = (req, res, next, val) => {
    if (val > tours.length) {
        // Remember that it's important to return from here
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    } 
    next();
}

exports.checkBody = (req, res, next) => {
    const objProperties = Object.keys(req.body);
    if (!objProperties.includes('name') && !objProperties.includes('price')) {
        return res.status(400).json({
            status: "failure",
            message: "Properties name or price not found!"
        });
    }

    next();
}

// (req, res) is known as the route handler
exports.getAllTours = (req, res) => {
    res.status(200).json({
        // Using the JSend specification
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
}

exports.getTour = (req, res) => {

    const id = req.params.id * 1; // Converting the value of id key (string) to a number, cool trick
    const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
    
}

exports.deleteTour = (req, res) => {
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

exports.updateTour = (req, res) => {
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