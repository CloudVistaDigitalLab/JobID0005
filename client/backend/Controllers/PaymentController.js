const Payment = require('../Models/Payment');

exports.processPayment = async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const { amount, cardNumber, expiryDate, cvv } = req.body;

    if (!amount || !cardNumber || !expiryDate || !cvv) {
      console.log('Missing Field:', { amount, cardNumber, expiryDate, cvv });
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const payment = new Payment({
      amount,
      cardNumber,
      expiryDate,
      cvv,
    });

    console.log('Payment Object to Save:', payment);

    await payment.save();
    res.status(201).json({ message: 'Payment processed successfully', payment });
  } catch (error) {
    console.error('Error in processPayment:', error);
    res.status(500).json({ message: 'Error processing payment', error });
  }
};
