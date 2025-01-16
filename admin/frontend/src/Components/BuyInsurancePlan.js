// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe('pk_test_51NacuHJErv40Lp7AlfXchT396ArW94ESJXnexLa2uHsEIEODHbERrGK72XUdaQLASxDEi8Qco3mGHJ9OBTyWioBw00vl1MJBLS'); // Use your Stripe publishable key

// const BuyInsurancePlan = () => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [clientSecret, setClientSecret] = useState('');
//     const [status, setStatus] = useState('');

//     useEffect(() => {
        
//         axios
//         .get('http://localhost:4002/payment-intent', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ amount: 5000 }), // Amount in cents ($50.00)
//         })
//             .then((res) => res.json())
//             .then((data) => setClientSecret(data.clientSecret))
//             .catch((error) => console.error('Error:', error));
//     }, []);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         const cardElement = elements.getElement(CardElement);

//         const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//             payment_method: {
//                 card: cardElement,
//             },
//         });

//         if (error) {
//             setStatus('Payment failed: ' + error.message);
//         } else if (paymentIntent.status === 'succeeded') {
//             setStatus('Payment succeeded!');
//         }
//     };

//     return (
//         <div>
//             <h1>Buy Insurance Plan</h1>
//             {clientSecret ? (
//                 <form onSubmit={handleSubmit}>
//                     <CardElement />
//                     <button type="submit" disabled={!stripe}>Pay LKR 50.00</button>
//                     <p>{status}</p>
//                 </form>
//             ) : (
//                 <p>Loading payment form...</p>
//             )}
//         </div>
//     );
// };

// const Wrapper = () => (
//     <Elements stripe={stripePromise}>
//         <BuyInsurancePlan />
//     </Elements>
// );

// export default Wrapper;
