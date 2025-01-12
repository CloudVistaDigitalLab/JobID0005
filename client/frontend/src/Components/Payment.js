import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, Box, IconButton, InputAdornment, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Components/LoadingScreen';


const Payment = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const [userEmail, setUserEmail] = useState('');
  
  
  
  const [clientInfo, setClientInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    identificationNumber: '',
    contactNumber: '',
    emailAddress: '',
    permanentAddress: '',
  });

  const [vehicleDetails, setVehicleDetails] = useState({
    registrationNumber: '',
    model: '',
    color: '',
    type: '',
    chassisNumber: '',
    engineCapacity: '',
    fuelType: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  
  
  const handlePayment = () => {
    setLoading(true);

    const userId = '67809823a22a73112f3daa4a'; // Replace this with actual user ObjectId

    const paymentData = {
      userId: userId, // Dynamically use the user’s ObjectId
      clientInfo,
      vehicleDetails,
      paymentInfo,
    };


      fetch('http://localhost:4000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Payment saved successfully:', data);
          // Additional success handling
        })
        .catch(error => {
          console.error('Error saving payment:', error);
        });
    
  
    // Check if email is available
    if (clientInfo.emailAddress) {
      // Simulate email sending after 4 seconds
      setTimeout(() => {
        sendEmail(clientInfo.emailAddress); // Send email after 4 seconds
      }, 4000);
  
      // Simulate navigating to profile page after 5 seconds
      setTimeout(() => {
        navigate('/'); // Use navigate to go to the profile page after 5 seconds
      }, 5000);
    } else {
      console.error('Email is missing');
    }
  };
  
  // Function to send email using the backend API
  const sendEmail = (email) => {
    const emailData = {
      email: email,
       
      message: 'Thanks for your payment!', // Customize the body of the email
    };
  
    fetch('http://localhost:4000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Email sent successfully:', data);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };


  const validateField = (name, value) => {
    let error = '';
    const sanitizedValue = value.trim();
  
    if (!sanitizedValue) {
      error = 'This field is required';
    } else {
      switch (name) {
        case 'emailAddress':
          // Validate email format
          if (!/\S+@\S+\.\S+/.test(sanitizedValue)) {
            error = 'Invalid email address';
          }
          break;
        case 'contactNumber':
          // Validate phone number (assuming 10 digits)
          if (!/^\d{10}$/.test(sanitizedValue)) {
            error = 'Invalid contact number';
          }
          break;
        case 'cardNumber':
          // Validate card number and remove hyphens
          if (!/^\d{16}$/.test(sanitizedValue.replace(/-/g, ''))) {
            error = 'Invalid card number';
          }
          break;
        case 'cvv':
          // Validate CVV (3 or 4 digits)
          if (!/^\d{3,4}$/.test(sanitizedValue)) {
            error = 'Invalid CVV';
          }
          break;
        case 'expiryDate':
          // Only check if the expiry date is in the future
          const [month, year] = sanitizedValue.split('/');
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed, so add 1
          const currentYear = currentDate.getFullYear().toString().slice(-2); // Get current 2-digit year
  
          // Check if expiry month/year is greater than or equal to current month/year
          if (parseInt(year) < parseInt(currentYear)) {
            error = 'Expiry date must be in the future';
          } else if (parseInt(year) === parseInt(currentYear) && parseInt(month) < currentMonth) {
            error = 'Expiry date must be in the future';
          }
          break;
        default:
          break;
      }
    }
  
    // Update error state for the specific field
    setErrors({ ...errors, [name]: error });
  
    // Return whether there is an error
    return error === '';
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1-')
        .trim();
      setPaymentInfo({ ...paymentInfo, [name]: formattedValue.slice(0, 19) });
    } else if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{2})/, '$1/$2')
        .slice(0, 5);
      setPaymentInfo({ ...paymentInfo, [name]: formattedValue });
    } else if (name in paymentInfo) {
      setPaymentInfo({ ...paymentInfo, [name]: value });
    } else if (name in clientInfo) {
      setClientInfo({ ...clientInfo, [name]: value });
    } else if (name in vehicleDetails) {
      setVehicleDetails({ ...vehicleDetails, [name]: value });
    }
    validateField(name, value);
  };

  const handleNext = () => {
    setStep(2);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  return (
    <div>
      
      <Box sx={{ padding: 4,marginTop:5,  minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, width: '60%', margin: '0 auto' }}>
        {step === 1 ? (
          <>
            <Typography variant="h4" sx={{ marginBottom: 4, textAlign: 'center' }}>
              Client and Vehicle Information
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Client Information</Typography>
                <Divider sx={{ marginBottom: 3 }} />
                {Object.keys(clientInfo).map((field, index) => (
                  <TextField
                    key={index}
                    label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    name={field}
                    fullWidth
                    margin="normal"
                    required
                    value={clientInfo[field]}
                    onChange={handleInputChange}
                    error={!!errors[field]}
                    helperText={errors[field]}
                  />
                ))}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Vehicle Details</Typography>
                <Divider sx={{ marginBottom: 3 }} />
                {Object.keys(vehicleDetails).map((field, index) => (
                  <TextField
                    key={index}
                    label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    name={field}
                    fullWidth
                    margin="normal"
                    required
                    value={vehicleDetails[field]}
                    onChange={handleInputChange}
                    error={!!errors[field]}
                    helperText={errors[field]}
                  />
                ))}
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
              <Button variant="contained" color="primary" onClick={handleNext} >
                Next
              </Button>
            </Box>
          </>
        ) : (
          loading ? (
            <LoadingScreen /> // Show loading screen if payment is in process
          ) : (
            <>
              <Typography variant="h4" sx={{ marginBottom: 4, textAlign: 'center' }}>
              Payment Information
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  label="Card Holder Name"
                  name="cardHolderName"
                  fullWidth
                  margin="normal"
                  required
                  value={paymentInfo.cardHolderName}
                  onChange={handleInputChange}
                  error={!!errors.cardHolderName}
                  helperText={errors.cardHolderName}
                />
                <TextField
                  label="Card Number"
                  name="cardNumber"
                  fullWidth
                  margin="normal"
                  required
                  value={paymentInfo.cardNumber}
                  onChange={handleInputChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  placeholder='XXXX-XXXX-XXXX-XXXX'
                />
                <TextField
                  label="Expiry Date (MM/YY)"
                  name="expiryDate"
                  fullWidth
                  margin="normal"
                  required
                  value={paymentInfo.expiryDate}
                  onChange={handleInputChange}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                />
                <TextField
                  label="CVV"
                  name="cvv"
                  fullWidth
                  margin="normal"
                  required
                  type='password'
                  value={paymentInfo.cvv}
                  onChange={handleInputChange}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ margin: '0 10px', height: '30px' }} />
                <img src="https://th.bing.com/th/id/OIP.fgkwCuz-ovfAcVMJP5srtwHaEK?rs=1&pid=ImgDetMain" alt="MasterCard" style={{ margin: '0 10px', height: '40px' }} />
                <img src="https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/16_Amex_Credit_Card-512.png" alt="American Express" style={{ margin: '0 10px', height: '45px' }} />
              </Grid>
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    onClick={handlePrevious}
                    fullWidth
                    sx={{ marginBottom: 3 }}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!(paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && !errors.cardNumber && !errors.expiryDate && !errors.cvv)}
                    onClick={handlePayment}
                  >
                    Pay Now
                  </Button>
                </Grid>
              </Grid>
            </Box>
            </>
          )
        )}
      </Paper>
      </Box>
    </div>
  );
};

export default Payment;