const express = require("express");
const { getAllQuotation } = require("../controllers/QuotationController");

const router = express.Router();

// Route to get all quotations
router.get("/all", getAllQuotation);

module.exports = router;
