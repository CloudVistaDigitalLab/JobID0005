// src/Components/PaymentFailure.js
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailure = () => {
  return (
    <div>
      <h1>Payment Canceled</h1>
      <p>Your payment was not successful. Please try again.</p>
      <Link to="/home">Go Back</Link>
    </div>
  );
};

export default PaymentFailure;
