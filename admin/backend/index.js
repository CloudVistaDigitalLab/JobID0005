const express = require('express');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const UserRouter = require('./Routes/UserRouter');
const QuotationsRouter = require('./Routes/QuotationRouter');
const claimRoutes = require('./Routes/ClaimRouter');
const PaymentRouter = require('./Routes/PaymentRouter');
const Stripe = require('stripe');


// Stripe
// const stripe = Stripe('sk_test_51NacuHJErv40Lp7ARaEwI3BeUyggZgVkp8TCuIqM0SLy1aWV78cuY7CwWmas3LVOJaDZF17DncMOsyF8SY3Hz4MT00PyelSDPs'); // Replace with your Stripe secret key


// newly added
const ClaimModel = require('./Models/Claim');
//////////////

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
require('./Models/db');

const PORT = process.env.PORT || 4002;
const app = express();
const fs = require('fs');
const path = require('path');

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Ping route to check if server is running
app.get('/ping', (req, res) => {
  res.send('PONG');
});

// Middleware
app.use(express.json());  // Built-in middleware for parsing JSON request bodies
app.use(cors());  // Enable CORS for cross-origin requests


// newly added
app.get('/getClaims', (req, res) =>{
  ClaimModel.find()
  .then(users => res.json(users))
  .catch(err => res.json(err))
})


//Stripe
// app.post('/create-payment-intent', async (req, res) => {
//   const { amount } = req.body; // Amount should be in cents

//   try {
//       const paymentIntent = await stripe.paymentIntents.create({
//           amount, // e.g., $10.00 -> 1000 cents
//           currency: 'usd', // Adjust the currency as needed
//       });

//       res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//       console.error('Error creating payment intent:', error);
//       res.status(500).json({ error: error.message });
//   }
// });





// Define API routes
app.use('/auth', AuthRouter);  // Authentication routes
app.use('/user', UserRouter);  // Authentication routes
app.use('/quotations', QuotationsRouter);  // Authentication routes
app.use('/products', ProductRouter);  // Product-related routes
app.use('/claims', claimRoutes);  // Claims routes 
app.use('/payments', PaymentRouter);  // Payment-related routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



