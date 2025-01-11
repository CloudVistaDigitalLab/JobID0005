const Claim = require('../Models/Claim');
exports.submitClaim = async (req, res) => {
    try {
      console.log('File:', req.file); 
      console.log('Body:', req.body); 
      console.log('Received data:', req.body);
  
      const { fullName, contactNumber, policyNumber, incidentDate, claimAmount, description } = req.body;
      const evidence = req.file ? req.file.path : null;
  
      const claim = new Claim({
        fullName,
        contactNumber,
        policyNumber,
        incidentDate,
        claimAmount,
        description,
        evidence,
      });
  
      await claim.save();
      res.status(201).json({ message: 'Claim submitted successfully', claim });
    } catch (error) {
      console.error("Error submitting claim:", error); 
      res.status(500).json({ message: 'Failed to submit claim', error: error.message });
    }
  };
  