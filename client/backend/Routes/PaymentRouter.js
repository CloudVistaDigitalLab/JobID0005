const express = require('express');
const cron = require('node-cron');
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


router.get('/payments/non-expired/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      
      const payments = await Payment.find({
        userId: userId,
        'paymentInfo.isExpired': false // Only non-expired plans
      });
  
      if (payments.length === 0) {
        return res.status(404).json({ message: 'No active payments found.' });
      }
  
      return res.json(payments);
    } catch (error) {
      console.error('Error fetching non-expired payments:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });


  router.get('/payments/expired/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      
      const payments = await Payment.find({
        userId: userId,
        'paymentInfo.isExpired': true // Only expired plans
      });
  
      if (payments.length === 0) {
        return res.status(404).json({ message: 'No expired payments found.' });
      }
  
      return res.json(payments);
    } catch (error) {
      console.error('Error fetching expired payments:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });











cron.schedule('0 0 * * *', async () => {
    try {
      const today = new Date();
      const payments = await Payment.find();
  
      for (const payment of payments) {
        const paymentDate = new Date(payment.paymentInfo.paymentDate);
        const diffInDays = Math.floor((today - paymentDate) / (1000 * 60 * 60 * 24)); // Calculate the difference in days
  
        if (diffInDays > 30 && !payment.paymentInfo.isExpired) {
          payment.paymentInfo.isExpired = true;
          await payment.save();
          console.log(`Plan expired for user: ${payment.userId}`);
        }
      }
  
      console.log('Expired status updated successfully.');
    } catch (error) {
      console.error('Error updating expired status:', error);
    }
  });


 
  

  


module.exports = router;
