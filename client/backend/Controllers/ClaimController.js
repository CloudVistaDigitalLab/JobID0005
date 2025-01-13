const Claim = require('../Models/Claim');

exports.submitClaim = async (req, res) => {
  try {
    console.log('File:', req.file);
    console.log('Body:', req.body);

    const {
      fullName,
      contactNumber,
      policyNumber,
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

    // Create the claim object with userId
    const claim = new Claim({
      fullName,
      contactNumber,
      policyNumber,
      incidentDate,
      claimAmount,
      description,
      uploadedURLs: uploadedURLsArray,
      userId, // Save userId to the claim
    });

    await claim.save();
    res.status(201).json({ message: 'Claim submitted successfully', claim });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ message: 'Failed to submit claim', error: error.message });
  }
};
