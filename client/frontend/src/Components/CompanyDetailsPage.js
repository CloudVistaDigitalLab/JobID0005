import React from 'react';
import { useParams ,useNavigate } from 'react-router-dom';

const CompanyDetailsPage = () => {
  const { companyName } = useParams(); // Get company name from URL

  // Sample company plan details (you can modify this with actual data or API)
  const companyPlans = {
    "Company 1": { price: "$199/month", amount: 19900, details: "Comprehensive coverage with roadside assistance." },
    "Company 2": { price: "$149/month", amount: 14900, details: "Affordable plan with accident coverage." },
    "Company 3": { price: "$179/month", amount: 17900, details: "Flexible options for occasional drivers." },
    "Company 4": { price: "$219/month", amount: 21900, details: "Premium coverage for full protection." },
    "Company 5": { price: "$129/month", amount: 12900, details: "Basic coverage for everyday drivers." },
  };

  const companyPlan = companyPlans[companyName] || { price: "N/A", amount: 0, details: "No details available." };
  const navigate = useNavigate();
  const handleBuyNow = () => {
    navigate(`/payment/${companyName}`); // Navigating to the payment page with the company name as a parameter
  };

  return (
    <div className="company-details-page">
      <h1>{companyName} Insurance Plans</h1>
      <p><strong>Price:</strong> {companyPlan.price}</p>
      <p><strong>Details:</strong> {companyPlan.details}</p>
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default CompanyDetailsPage;
