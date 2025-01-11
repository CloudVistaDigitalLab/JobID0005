const express = require('express');
const multer = require('multer');
const { submitClaim } = require('../Controllers/claimController');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Use `upload.array` to handle multiple file uploads
router.post('/', upload.array('evidenceFiles', 10), submitClaim); // Allow up to 10 files

module.exports = router;
