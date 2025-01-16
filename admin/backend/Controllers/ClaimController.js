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
const claimModel = require('../Models/Claim');
const nodemailer = require('nodemailer');

exports.updateClaimStatus = async (req, res) => {
    try {
        const { _id, status } = req.body;

        if (!_id || !status) {
            return res.status(400).json({ message: 'Claim ID and status are required' });
        }

        const updatedClaim = await claimModel.findByIdAndUpdate(
            _id,
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

exports.acceptCliam = async (req, res) => {
    try {
        const { _id, status, acceptedAmount} = req.body;
        if (!_id || !status) {
            return res.status(400).json({ message: 'Claim ID and status are required' });
        }
        const updatedClaim = await claimModel.findByIdAndUpdate(
            _id,
            { status, acceptedAmount },
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
}

exports.rejectCliam = async (req, res) => {
    try {
        const { _id, status, adminDescription} = req.body;
        if (!_id || !status) {
            return res.status(400).json({ message: 'Claim ID and status are required' });
        }
        const updatedClaim = await claimModel.findByIdAndUpdate(
            _id,
            { status, adminDescription },
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
}

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'geeshanthisera1234@gmail.com',
        pass: 'qr gq kf ot vn iy tt xi',
    },
});

// Endpoint to send email
exports.sendEmail = async (req, res) => {
    const { email, message, subject } = req.body;

    const mailOptions = {
        from: 'geeshanthisera1234@gmail.com',
        to: email,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(500).send('Failed to send email');
        }
        res.status(200).send('Email sent successfully');
    });
};
