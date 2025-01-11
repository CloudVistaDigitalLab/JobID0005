import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('your-publishable-key-here');

function PaymentPage() {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);

    useEffect(() => {
        fetch(`/api/companies/${companyId}`)
            .then(response => response.json())
            .then(data => setCompany(data));
    }, [companyId]);

    if (!company) return <p>Loading...</p>;

    return (
        <div className="payment-container">
            <h2>Payment for {company.name}</h2>
            <p>You are purchasing insurance plan: {company.selectedPlan.name}</p>
            <Elements stripe={stripePromise}>
                <CheckoutForm amount={company.selectedPlan.price} />
            </Elements>
        </div>
    );
}

export default PaymentPage;
