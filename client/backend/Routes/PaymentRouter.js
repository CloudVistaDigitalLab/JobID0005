const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const { Payment, PolicyCounter } = require('../Models/Payment');
const Unsubscribe = require('../Models/Unsubscribe'); // Assuming the Unsubscribe model is defined

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


router.post('/payments', async (req, res) => {
  try {
    const {
      userId,
      clientInfo,
      vehicleDetails,
      paymentInfo
    } = req.body;

    // Validate required fields
    if (!userId || !vehicleDetails || !paymentInfo) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Generate claim ID
    let policyIdCounter = await PolicyCounter.findOne({ modelName: 'Payment' });
    if (!policyIdCounter) {
      policyIdCounter = new PolicyCounter({ modelName: 'Payment', sequenceValue: 1 });
    } else {
      policyIdCounter.sequenceValue += 1;
    }
    await policyIdCounter.save();
    const policyId = 'UP' + String(policyIdCounter.sequenceValue).padStart(7, '0');

    // Create and save payment
    const payment = new Payment({
      userId,
      policyId,
      clientInfo,
      vehicleDetails,
      paymentInfo,
    });

    await payment.save();

    console.log('Payment details saved successfully');
    res.status(200).json({
      success: true,
      message: 'Payment details saved successfully',
      policyId,
    });
  } catch (error) {
    console.error('Error saving payment details:', error);
    res.status(500).json({ success: false, message: 'Error saving payment details' });
  }
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


router.get('/user-payments/payId/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Get the 'id' from the URL parameters
    const payment = await Payment.findById(id);  // Use findById to get a single payment by its ID
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' }); // If no payment found, return 404
    }
    
    res.json(payment);  // Return the found payment
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment' });
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



  router.get('/payments/non-expired/unsubs/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch non-expired payment plans for the user
        const payment = await Payment.findOne({ userId, isExpired: false });

        if (!payment) {
            return res.status(404).json({ message: 'No active payment plan found.' });
        }

        return res.json(payment); // Return the payment details
    } catch (error) {
        console.error('Error fetching payment plan:', error);
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


  router.get('/payments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id);
  
      if (!payment) {
        return res.status(404).json({ message: 'Payment plan not found.' });
      }
  
      // Log the subscriptionEndDate to ensure it is being stored correctly
      console.log('Subscription End Date:', payment.paymentInfo.subscriptionEndDate);
  
      return res.json(payment); // Send the payment details as a JSON response
    } catch (error) {
      console.error('Error fetching payment plan:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  

// renew update
router.put('/payments/renew/:id', async (req, res) => {
  try {
    const { paymentInfo } = req.body;

    if (!paymentInfo) {
      return res.status(400).send('Payment information is required');
    }

    const paymentId = req.params.id;

    // Prepare the update object
    const updateData = {
      'paymentInfo.isExpired': false,
      'paymentInfo.paymentDate': new Date().toISOString().split('T')[0], // Current date in 'YYYY-MM-DD' format
    };

    // Update the payment info
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      updateData,
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).send('Payment plan not found');
    }

    return res.status(200).json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment plan:', error);
    return res.status(500).send('Error updating payment plan');
  }
});


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming the token is passed as "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = decoded; // Save the decoded token (user info) in the request
    next();
  });
};

// Route to handle unsubscribe requests




router.delete('/delete/:id', (req, res) => {
  Payment.findByIdAndDelete(req.params.id).then(() => {
      res.send('payment deleted successfully')
  }).catch((err) => {
      return res.status(500).send('Error occurred')
  })
})





// router.post('/unsubscribe', (req, res) => {
//   const newUnsubscribe = new Unsubscribe(req.body);

//   newUnsubscribe.save()
//       .then(() => {
//           console.log('details are saved successfully');
//           return res.status(200).json({
//               success: " details are saved successfully"
//           });
//       })
//       .catch((err) => {
//           console.error(err);
//           return res.status(400).json({
//               error: err
//           });
//       });
// });


router.post('/unsubscribe', async (req, res) => {

    try {
      const {
        userId,
        paymentId,
        reason,
        subscriptionEndDate,
        clientInfo,
        vehicleDetails,
        paymentInfo,
      } = req.body;
  
      const unsubscribeDate = new Date().toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD' format
  
      // Save the unsubscribe data
      const unsubscribe = new Unsubscribe({
        userId,
        paymentId,
        reason,
        subscriptionEndDate,
        unsubscribeDate,
        clientInfo,
        vehicleDetails,
        paymentInfo,
      });
  
      await unsubscribe.save();
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving unsubscribe details:', error);
      res.status(500).json({ success: false, message: 'Error saving unsubscribe details' });
    }
  });




  router.get('/unsubscribedPlans/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const plans = await Unsubscribe.find({ userId});
        res.json(plans);
    } catch (error) {
        console.error('Error fetching unsubscribed plans:', error);
        res.status(500).send('Server error');
    }
});






const deleteExpiredUnsubscribes = async () => {
  try {
      const result = await Unsubscribe.deleteMany({
          $expr: {
              $lt: [
                  { $dateFromString: { dateString: "$subscriptionEndDate" } },
                  { $dateFromString: { dateString: "$unsubscribeDate" } }
              ]
          }
      });

      console.log(`${result.deletedCount} expired unsubscribed plans deleted.`);
  } catch (error) {
      console.error('Error cleaning up expired unsubscribes:', error);
  }
};


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














cron.schedule('*/10 * * * * *', async () => {
  console.log('Running scheduled cleanup...');
  await deleteExpiredUnsubscribes();
});

// expired status update
cron.schedule('*/10 * * * * *', async () => {
  try {
    const today = new Date();
    const payments = await Payment.find();

    for (const payment of payments) {
      const paymentDate = new Date(payment.paymentInfo.paymentDate);
      const diffInDays = Math.floor((today - paymentDate) / (1000 * 60 * 60 * 24)); // Calculate the difference in days

      if (diffInDays > 365 && !payment.paymentInfo.isExpired) {
        payment.paymentInfo.isExpired = true;
        await payment.save();
        console.log(`Plan expired for user: ${payment.userId}`);
      }
    }

    console.log('Expired status checked and updated.');
  } catch (error) {
    console.error('Error updating expired status:', error);
  }
});



 
  

  


module.exports = router;
