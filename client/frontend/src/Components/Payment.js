import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper, Typography, Box, IconButton, InputAdornment, Divider } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import LoadingScreen from '../Components/LoadingScreen';
import Successfull from '../Components/Successfull';
import { jwtDecode } from 'jwt-decode';

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


const Payment = () => {
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);





    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);  // Decode the token
                setUserId(decodedToken.userId);  // Extract the userId
            } catch (error) {
                console.error('Error decoding token', error);
            }
        }
    }, []);


    const { companyName } = useParams();

    // Retrieve the corresponding company plan, or a default if not found
    const companyPlan = companyPlans[companyName] || { price: "N/A", amount: 0, details: "No details available." };

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
        price: companyPlan.price,
    });

    const [errors, setErrors] = useState({});


    const handlePayment = () => {
        setLoading(true);
    
        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found, user is not authenticated');
            return;
        }
    
        // Decode the token to extract the userId (_id)
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id; // Extract the _id from the decoded token
    
        const paymentData = {
            userId: userId, // Dynamically use the user’s ObjectId
            clientInfo,
            vehicleDetails,
            paymentInfo,
        };
    
        // Make the payment API call
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
    
                // Show loading for 4 seconds before transitioning to success message
                setTimeout(() => {
                    setLoading(false);
                    setPaymentSuccess(true); // Show success message after 4 seconds
                }, 4000);
    
                // Send email after 4 seconds (simulate email sending)
                if (clientInfo.emailAddress) {
                    setTimeout(() => {
                        sendEmail(clientInfo.emailAddress); // Send email after 4 seconds
                    }, 3000);
                } else {
                    console.error('Email is missing');
                }
    
                // Simulate navigation to profile page after success message (2 seconds)
                setTimeout(() => {
                    setPaymentSuccess(false); // Hide the success message after 2 seconds
                    navigate('/'); // Navigate to profile page after 2 seconds
                }, 6000); // 4 seconds for loading + 2 seconds for success message
            })
            .catch(error => {
                console.error('Error saving payment:', error);
                setLoading(false);
            });
    };
    
    // Function to send email using the backend API
    const sendEmail = (email) => {
        const emailData = {
            email: email,

            message: `Dear Customer,

Thank you for your recent transaction with us. We are pleased to confirm that your payment has been successfully processed.

Please find the details of your payment below:

**Company:** Company 3
**From:** Vehicle Insurance Co. (Finance Division)
**Price:** $179/month

This is an automated message generated by the system. Please do not reply to this email. If you have any questions, feel free to contact our customer service team.

Best regards,
The Finance Team at Vehicle Insurance Co.

Note: This is an auto-generated message, and no reply is required.
`, // Customize the body of the email
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

            <Box sx={{ padding: 4, marginTop: 5, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                            <div style={{ textAlign: 'center', marginTop: 20 }}>
                                <h1>Please wait a moment to complete your insurance plan</h1>
                                <LoadingScreen />
                            </div>
                        ) : paymentSuccess ? (
                            <div style={{ textAlign: 'center', marginTop: 20 }}>
                                <Successfull/>
                                <Typography variant="h4" sx={{ marginBottom: 2 }}>
                                    Payment Successful
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: 4 }}>
                                    Thank you for your payment. Your insurance plan has been successfully processed.
                                </Typography>
                            </div>
                        ) : (
                            <>
                                <Typography variant="h4" sx={{ marginBottom: 4, textAlign: 'center' }}>
                                    Payment Information


                                </Typography>
                                <Box
                                    sx={{
                                        padding: 2,

                                        borderRadius: 2,
                                        boxShadow: 2,
                                        textAlign: 'center',
                                        width: '30%',
                                        margin: '0 auto',
                                    }}
                                >
                                    <p style={{ color: '#FE9900', fontSize: '18px', fontWeight: 'bold' }}>Price: {companyPlan.price}</p>
                                </Box>
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