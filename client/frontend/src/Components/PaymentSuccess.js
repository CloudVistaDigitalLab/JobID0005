// src/Components/PaymentSuccess.js
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you for your purchase! Your insurance plan has been activated.</p>
      <Link to="/home">Go to Dashboard</Link>
    </div>
  );
};

export default PaymentSuccess;
