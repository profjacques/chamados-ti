const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const dashboard = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', asyncHandler(dashboard.index));
router.use('/chamados', require('./chamados'));

module.exports = router;
