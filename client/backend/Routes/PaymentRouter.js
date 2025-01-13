const express = require('express');
const router = express.Router();
const Payment = require('../Models/Payment'); // Assuming the Payment model is defined
const nodemailer = require('nodemailer');

// Endpoint to save payment details
// router.post('/payments', async (req, res) => {
//     try {
//         const paymentData = req.body;
//         const newPayment = new Payment(paymentData);

//         await newPayment.save();
//         res.status(201).json({ message: 'Payment saved successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to save payment' });
//     }
// });


router.post('/payments', (req, res) => {
  const newPayment = new Payment(req.body);

  newPayment.save()
      .then(() => {
          console.log('Released Item details are saved successfully');
          return res.status(200).json({
              success: "Released Item details are saved successfully"
          });
      })
      .catch((err) => {
          console.error(err);
          return res.status(400).json({
              error: err
          });
      });
});


// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'geeshanthisera1234@gmail.com',
        pass: 'qr gq kf ot vn iy tt xi', // Ensure this is secure
    },
});

// Endpoint to send email
router.post('/send-email', (req, res) => {
    const { email, message } = req.body;

    const mailOptions = {
        from: 'geeshanthisera1234@gmail.com',
        to: email,
        subject: 'Payment Confirmation',
        text: message,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(500).send('Failed to send email');
        }
        res.status(200).send('Email sent successfully');
    });
});


router.get('/user-payments/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const payments = await Payment.find({ userId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});




module.exports = router;
