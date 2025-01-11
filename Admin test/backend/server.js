require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const claimRoutes = require('./Routes/ClaimRouter');
const paymentRoutes = require('./Routes/PaymentRouter');
const app = express();


app.use(express.json());
app.use('/uploads', express.static('uploads'));


// app.use('/api/claim', claimRouter);
app.use('/api/payment', paymentRouter);


const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



app.use('/api', claimRoutes);
