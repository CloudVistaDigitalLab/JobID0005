const Claim = require('../Models/Claim');
const ClaimIdCounter = require('../Models/ClaimIdCounter');

exports.submitClaim = async (req, res) => {
  try {
    console.log('File:', req.file);
    console.log('Body:', req.body);

    const {
      fullName,
      contactNumber,
      policyNumber,
      vehicleNumber,
      garageSelected,
      incidentDate,
      claimAmount,
      description,
      uploadedURLs,
      userId, // Make sure userId is part of the request body
    } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Parse `uploadedURLs` if it's sent as a JSON string
    const uploadedURLsArray = Array.isArray(uploadedURLs)
      ? uploadedURLs
      : JSON.parse(uploadedURLs);

    // Fetch the current claim ID counter and increment it
    let claimIdCounter = await ClaimIdCounter.findOne({ modelName: 'Claim' });

    if (!claimIdCounter) {
      // If no counter exists, create one starting from 1
      claimIdCounter = new ClaimIdCounter({ modelName: 'Claim', sequenceValue: 1 });
      await claimIdCounter.save();
    } else {
      // Increment the counter
      claimIdCounter.sequenceValue += 1;
      await claimIdCounter.save();
    }

    // Generate the custom claim ID
    const claimId = 'IC' + String(claimIdCounter.sequenceValue).padStart(7, '0');

    // Create the claim object with userId and the generated claim ID
    const claim = new Claim({
      claimId, // Include the generated claim ID
      fullName,
      contactNumber,
      policyNumber,
      vehicleNumber,
      garageSelected,
      incidentDate,
      claimAmount,
      description,
      uploadedURLs: uploadedURLsArray,
      userId, // Save userId to the claim
    });

    // Save the claim to the database
    await claim.save();

    res.status(201).json({ message: 'Claim submitted successfully', claim });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ message: 'Failed to submit claim', error: error.message });
  }
};
