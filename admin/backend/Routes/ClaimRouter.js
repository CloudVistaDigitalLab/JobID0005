const express = require('express');
const Claim = require('../Models/Claim');
const { updateClaimStatus, getPendingClaims, getApprovedClaims, acceptCliam, rejectCliam } = require('../Controllers/ClaimController');
const router = express.Router();

// Route to get all pending claims
router.get('/pending-claims', getPendingClaims);

// Route to get all approved claims
router.get('/approved-claims', getApprovedClaims);

// Route to update claim status (approve/reject)
router.patch('/update-claim-status', updateClaimStatus);
router.patch('/accept-claim', acceptCliam);
router.patch('/reject-claim', rejectCliam);
router.post('/send-email', rejectCliam);

module.exports = router;
