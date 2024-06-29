const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = express.Router();

// Param middleware - to check for parameters, useful for checking if the id is valid in this case
// Useful for validation purposes, so that we don't have to do it in our actual controller functions
router.param('id', tourController.checkId);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.updateTour);

// In the above post method, we're essentially chaining middleware (this one checks the request body)
// We do this to sort of separate our updateTour middleware, whose only job should be to well, update the tour
// Everything else, like logging in, validation related stuff should be done in their own middleware and by chaining them like we did here

router
    .route('/:id')
    .get(tourController.getTour)
    .delete(tourController.deleteTour); 

// We only have to export a single thing here, so we're using module.exports
module.exports = router;