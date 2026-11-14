const express = require('express');
const router = express.Router();
const {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');

// Routes for /api/opportunities
router
  .route('/')
  .get(getAllOpportunities)
  .post(createOpportunity);

// Routes for /api/opportunities/:id
router
  .route('/:id')
  .get(getOpportunityById)
  .put(updateOpportunity)
  .delete(deleteOpportunity);

module.exports = router;
