import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../index.css';

function PayInsurance() {
  const navigate = useNavigate(); 
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    paymentMethod: 'Credit Card',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (parseFloat(paymentDetails.amount) <= 0) {
      setPaymentStatus('Amount must be greater than zero.');
      return;
    }
    if (paymentDetails.paymentMethod === 'Credit Card' && paymentDetails.cardNumber.length !== 16) {
      setPaymentStatus('Card number must be 16 digits.');
      return;
    }
    if (paymentDetails.paymentMethod === 'Credit Card' && paymentDetails.cvv.length !== 3) {
      setPaymentStatus('CVV must be 3 digits.');
      return;
    }

    const paymentData = {
      amount: paymentDetails.amount,
      paymentMethod: paymentDetails.paymentMethod,
      cardNumber: paymentDetails.cardNumber,
      expiryDate: paymentDetails.expiryDate,
      cvv: paymentDetails.cvv,
    };

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      const response = await fetch('http://localhost:4000/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

   
      if (response.ok) {
        setTimeout(() => {
          setIsProcessing(false);
          setPaymentStatus('Payment successful!');
        }, 2000);
      } else {
        setTimeout(() => {
          setIsProcessing(false);
          setPaymentStatus(`Error: ${data.message || 'Something went wrong.'}`);
        }, 2000);
      }
    } catch (error) {
      setPaymentStatus('An error occurred while processing the payment.');
      setIsProcessing(false);
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    console.log('User Logged out'); 
    setTimeout(() => {
      navigate('/home');
    }, 1000);
  };

  return (
    <section className="payment-section">
      <header>
        <h1>Vehicle Insurance Co.</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <h3>Pay Insurance</h3>
      {paymentStatus && <p className="status-message">{paymentStatus}</p>}

      <form onSubmit={handlePayment}>
        <input
          type="number"
          name="amount"
          placeholder="Enter Amount"
          value={paymentDetails.amount}
          onChange={handleChange}
          required
        />

        <select name="paymentMethod" value={paymentDetails.paymentMethod} onChange={handleChange}>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="PayPal">PayPal</option>
        </select>

        {paymentDetails.paymentMethod === 'Credit Card' && (
          <>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={paymentDetails.cardNumber}
              onChange={handleChange}
              maxLength="16"
              required
            />
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={paymentDetails.expiryDate}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={paymentDetails.cvv}
              onChange={handleChange}
              maxLength="3"
              required
            />
          </>
        )}

        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </section>
  );
}

export default PayInsurance;
