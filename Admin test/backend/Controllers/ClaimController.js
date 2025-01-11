// // ClaimController.js

// const Claim = require('../Models/Claim');

// // Update claim status (approve or reject)
// exports.updateClaimStatus = async (req, res) => {
//     try {
//         const { claimId, status } = req.body; // Extract claim ID and status from the request body

//         if (!claimId || !status) {
//             return res.status(400).json({ message: 'Claim ID and status are required' });
//         }

//         // Update the claim status in the database
//         const updatedClaim = await Claim.findByIdAndUpdate(
//             claimId,
//             { status }, // Update status field
//             { new: true } // Return the updated document
//         );

//         if (!updatedClaim) {
//             return res.status(404).json({ message: 'Claim not found' });
//         }

//         res.status(200).json({ message: 'Claim status updated successfully', updatedClaim });
//     } catch (error) {
//         console.error("Error updating claim status:", error);
//         res.status(500).json({ message: 'Failed to update claim status', error: error.message });
//     }
// };

// // Get all pending claims
// exports.getPendingClaims = async (req, res) => {
//     try {
//         const claims = await Claim.find({ status: 'Pending' }); // Filter claims with 'Pending' status
//         res.status(200).json(claims);
//     } catch (error) {
//         console.error("Error fetching pending claims:", error);
//         res.status(500).json({ message: 'Error fetching pending claims', error: error.message });
//     }
// };

// // Get all approved claims
// exports.getApprovedClaims = async (req, res) => {
//     try {
//         const claims = await Claim.find({ status: 'Approved' }); // Filter claims with 'Approved' status
//         res.status(200).json(claims);
//     } catch (error) {
//         console.error("Error fetching approved claims:", error);
//         res.status(500).json({ message: 'Error fetching approved claims', error: error.message });
//     }
// };




// ClaimController.js

// Update claim status (approve or reject)
exports.updateClaimStatus = async (req, res) => {
    try {
        const { claimId, status } = req.body;

        if (!claimId || !status) {
            return res.status(400).json({ message: 'Claim ID and status are required' });
        }

        const updatedClaim = await Claim.findByIdAndUpdate(
            claimId,
            { status },
            { new: true }
        );

        if (!updatedClaim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        res.status(200).json({ message: 'Claim status updated successfully', updatedClaim });
    } catch (error) {
        console.error("Error updating claim status:", error);
        res.status(500).json({ message: 'Failed to update claim status', error: error.message });
    }
};

// Get all pending claims
exports.getPendingClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ status: 'Pending' });
        res.status(200).json(claims);
    } catch (error) {
        console.error("Error fetching pending claims:", error);
        res.status(500).json({ message: 'Error fetching pending claims', error: error.message });
    }
};

// Get all approved claims
exports.getApprovedClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ status: 'Approved' });
        res.status(200).json(claims);
    } catch (error) {
        console.error("Error fetching approved claims:", error);
        res.status(500).json({ message: 'Error fetching approved claims', error: error.message });
    }
};
