const express = require('express');
const { processPayment } = require('../Controllers/paymentController');
const router = express.Router();


router.post('/', processPayment);

module.exports = router;
