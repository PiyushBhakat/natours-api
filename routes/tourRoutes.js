const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = express.Router();

// Param middleware - to check for parameters, useful for checking if the id is valid in this case
router.param('id', tourController.checkId);

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