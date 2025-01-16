const express = require('express');
const router = express.Router();
const Garage = require('../models/garageModel');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'geeshanthisera1234@gmail.com',
        pass: 'qr gq kf ot vn iy tt xi', 
    },
});

router.post('/garage', async (req, res) => {
  try {
    const { claimId, vehicleNumber, clientName, garageName, file, note, userId } = req.body;

    
    if (!claimId || !vehicleNumber || !clientName || !garageName || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newGarage = new Garage({
      claimId,
      vehicleNumber,
      clientName,
      garageName,
      file,  
      note,
      userId,
    });

    await newGarage.save();
    res.status(201).json({ message: 'Payment saved successfully', garage: newGarage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save payment' });
  }
});


router.post('/send-email/contactUs', (req, res) => {
  const { email, message , about } = req.body;

  const mailOptions = {
      from: email,
      to: 'geeshanthisera1234@gmail.com',
      subject: about,
      text: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
          return res.status(500).send('Failed to send email');
      }
      res.status(200).send('Email sent successfully');
  });
});

module.exports = router;
