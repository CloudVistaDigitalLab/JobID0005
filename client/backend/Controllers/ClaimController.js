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
      userId, 
    } = req.body;

    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    
    const uploadedURLsArray = Array.isArray(uploadedURLs)
      ? uploadedURLs
      : JSON.parse(uploadedURLs);

    
    let claimIdCounter = await ClaimIdCounter.findOne({ modelName: 'Claim' });

    if (!claimIdCounter) {
      
      claimIdCounter = new ClaimIdCounter({ modelName: 'Claim', sequenceValue: 1 });
      await claimIdCounter.save();
    } else {
      
      claimIdCounter.sequenceValue += 1;
      await claimIdCounter.save();
    }

    
    const claimId = 'IC' + String(claimIdCounter.sequenceValue).padStart(7, '0');

    
    const claim = new Claim({
      claimId, 
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
