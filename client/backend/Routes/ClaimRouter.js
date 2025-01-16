const express = require('express');
const multer = require('multer');
const { submitClaim } = require('../Controllers/ClaimController');
const router = express.Router();
const Claim = require('../Models/Claim');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });


router.post('/', upload.array('evidenceFiles', 10), submitClaim); 

exports.getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id); 

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

  
    const claimIdNumericPart = claim.claimId.slice(2); 

 
    const incrementedClaimIdNumericPart = (parseInt(claimIdNumericPart, 10) + 1).toString().padStart(7, '0'); 

   
    const updatedClaimId = 'IC' + incrementedClaimIdNumericPart;

 
    res.json({
      ...claim.toObject(),
      updatedClaimId,
    });
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ message: 'Failed to fetch claim', error: error.message });
  }
};



// router.get('/getclaim', (req, res) => {
//   Claim.find().exec().then((results) => {
//       console.log(results)
//       return res.status(200).json({
//           success: true,
//           existingDetails: results
//       })
//   }).catch((err) => {
//       console.error(err)
//   })
// })


router.get('/getclaimbyID/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const claim = await Claim.find({ userId });
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

router.get('/getclaim-lastly-added', (req, res) => {
  
  Claim.find().sort({ _id: -1 }).limit(1).exec()
    .then((results) => {
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'No claims found' });
      }
      console.log(results);
      return res.status(200).json({
        success: true,
        existingDetails: results[0]  
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching claim',
        error: err.message
      });
    });
});

router.get('/getclaim', (req, res) => {
  Claim.find().sort({ _id: -1 }).limit(1).exec().then((results) => {
    if (results.length > 0) {
      const claim = results[0]; 
      const claimIdNumericPart = claim.claimId.slice(2); 
      const nextClaimIdNumericPart = (parseInt(claimIdNumericPart, 10) + 1).toString().padStart(7, '0'); 

      const nextClaimId = 'IC' + nextClaimIdNumericPart;

      return res.status(200).json({
        success: true,
        existingDetails: claim,
        nextClaimId, 
      });
    } else {
      res.status(404).json({ success: false, message: 'No claims found' });
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching claim', error: err.message });
  });
});




module.exports = router;
