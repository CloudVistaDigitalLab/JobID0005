import { Box, Paper, Container, Typography, Button } from '@mui/material';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CompanyDetailsPage = () => {
  const { companyName } = useParams(); 

  const companyPlans = {
    "Company 1": { 
      price: "Rs19900/month", 
      amount: 19900, 
      details: "Comprehensive coverage with roadside assistance. Includes collision, theft, fire, and vandalism protection. 24/7 customer support and access to over 1,000 repair shops nationwide. Additional discounts for safe driving and bundling multiple policies."
    },
    "Company 2": { 
      price: "Rs14900/month", 
      amount: 14900, 
      details: "Affordable plan with accident coverage. Offers protection for medical bills, vehicle repairs, and lost wages in case of an accident. Includes free accident forgiveness and a rental car option while your vehicle is being repaired."
    },
    "Company 3": { 
      price: "Rs17900/month", 
      amount: 17900, 
      details: "Flexible options for occasional drivers. Pay-per-mile coverage option for those who drive less than 10,000 miles per year. Includes optional coverage for roadside assistance, rental reimbursement, and personal injury protection."
    },
    "Company 4": { 
      price: "Rs21900/month", 
      amount: 21900, 
      details: "Premium coverage for full protection. Covers everything from natural disasters to comprehensive liability. Includes free windshield repair, guaranteed new car replacement, and a 5-star claims service experience. Priority customer support with a dedicated agent."
    },
    "Company 5": { 
      price: "Rs12900/month", 
      amount: 12900, 
      details: "Basic coverage for everyday drivers. Includes protection against liability, collision, and comprehensive damage. Ideal for drivers who need essential coverage with no-frills. Special discounts for students, seniors, and military personnel."
    },
  };
  

  const companyPlan = companyPlans[companyName] || { price: "N/A", amount: 0, details: "No details available." };
  const navigate = useNavigate();

  const handleBuyNow = () => {
    const isLoggedIn = localStorage.getItem('token');

    if (isLoggedIn) {
      navigate(`/payment/${companyName}`, {
        state: { companyPlan }
      });
    } else {
      navigate('/login', {
        state: { redirectTo: `/payment/${companyName}`, companyPlan }
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{marginTop:15,marginBottom:15, padding: '20px', borderRadius: '12px', boxShadow: 3 }}>
      <Paper sx={{ padding: '20px',  borderRadius: '12px', boxShadow: 1 ,margin:'50px'}}>
        <Typography variant="h4" component="h1" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#3f51b5', textAlign: 'center' }}>
          {companyName} Insurance Plans
        </Typography>
        
        <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 'bold',textAlign:'center' }}>
          <strong>Price:</strong> {companyPlan.price}
        </Typography>
        
        <Typography variant="body1" sx={{ marginBottom: 3, textAlign:'center'   }}>
          <strong>Details:</strong> {companyPlan.details}
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleBuyNow}
            sx={{
              padding: '10px 30px', 
              fontSize: '1.2em', 
              fontWeight: 'bold', 
              borderRadius: '30px', 
              boxShadow: 3,
              
              '&:hover': { backgroundColor: '#5B6B7C' }
            }}
          >
            Buy Now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CompanyDetailsPage;
