// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const AuthRouter = require('./Routes/AuthRouter');
// const ProductRouter = require('./Routes/ProductRouter');
// const ClaimRouter = require('./Routes/ClaimRouter');
// const PaymentRouter = require('./Routes/PaymentRouter');

// require('dotenv').config();
// require('./Models/db');
// const PORT = process.env.PORT || 4000;

// const app = express();
// const fs = require('fs');
// const path = require('path');

// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// app.get('/ping', (req, res) => {
//     res.send('PONG');
// });

// app.use(bodyParser.json());
// app.use(cors());
// app.use('/auth', AuthRouter);
// app.use('/products', ProductRouter);
// app.use('/api/claim', ClaimRouter);
// app.use('/api/payment', PaymentRouter);

// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const ClaimRouter = require('./Routes/ClaimRouter');
const Stripe = require('stripe'); // Stripe library
const PaymentRouter = require('./Routes/PaymentRouter');
const paymentRoutes = require('./Routes/PaymentRouter');


require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 4000;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Stripe secret key from .env

const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Routers
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/api/claim', ClaimRouter);
app.use('/api', paymentRoutes);


// Ping route for testing
app.get('/ping', (req, res) => {
  res.send('PONG');
});

// Stripe Payment Route
app.post('/api/payment/create-checkout-session', async (req, res) => {
  const { planName, amount } = req.body;

  // Add this line to use the payment routes
// app.use('/api/payment', PaymentRouter);


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
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});



