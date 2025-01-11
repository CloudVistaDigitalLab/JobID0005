const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();  // Load environment variables

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);  // Initialize Stripe with the secret key

router.post('/create-checkout-session', async (req, res) => {
  const { planName, amount } = req.body;

  if (!planName || !amount) {
    return res.status(400).json({ error: 'Plan name and amount are required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planName} Insurance Plan`,
            },
            unit_amount: amount,  // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,  // Use CLIENT_URL for success page
      cancel_url: `${process.env.CLIENT_URL}/cancel`,  // Use CLIENT_URL for cancel page
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
