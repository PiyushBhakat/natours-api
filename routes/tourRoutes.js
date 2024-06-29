const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = express.Router();

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.updateTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .delete(tourController.deleteTour); 

// We only have to export a single thing here, so we're using module.exports
module.exports = router;