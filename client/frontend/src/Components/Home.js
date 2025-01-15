import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Badge from '@mui/material/Badge';
import { Button, Typography, FormHelperText, Box, Grid, Paper, Container, Tab, Tabs, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, colors } from '@mui/material';
import axios from 'axios';

import { jwtDecode } from 'jwt-decode';

function Home() {
    const [clientData, setClientData] = useState([]);
    const [claimtData, setClaimtData] = useState([]);
    const [expiredPlans, setExpiredPlans] = useState([]);
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = useState(false);
    const [paymentId, setPaymentId] = useState('');
    const [userId, setUserId] = useState(null);
    const [payments, setPayments] = useState([]);


    const reasons = [
        'High premiums',
        'Found a better plan elsewhere',
        'No longer need insurance',
        'Dissatisfied with customer service',
        'Coverage not sufficient',
        'Financial difficulties',
        'Switching to a different provider',
        'Policy terms are not clear',
        'Unexpected fees or charges',
        'Other reasons',
    ];


    // const handleOpen = (paymentId) => {
    //     setPaymentId(paymentId);  // Store paymentId in the state
    //     setOpen(true);
    // };


    useEffect(() => {
        // Fetch the payments from the backend API
        const fetchPayments = async () => {
            try {
                const response = await axios.get('/api/payments');
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchPayments();
    }, []);

    const handleOpen = (paymentId) => {
        console.log('Unsubscribe Payment ID:', paymentId); // This should log the ID
        setPaymentId(paymentId);  // Store paymentId in the state
        setOpen(true); // Open the modal or proceed with the unsubscribe logic
    };


    const handleClose = () => setOpen(false);
    // unsubscribe

    const [unsubscribeDetails, setUnsubscribeDetails] = useState({
        username: '',
        email: '',
        contactNumber: '',
        identificationNumber: '',
        reason: '',
        reasonDescription: '',
        subscriptionEndDate: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [selectedUsername, setSelectedUsername] = useState('')
    const [selectedEmail, setSelectedEmail] = useState('')
    const [selectedContactNumber, setSelectedContactNumber] = useState('')
    const [selectedIdentificationNumber, setSelectedIdentificationNumber] = useState('')
    const [selectedReason, setSelectedReason] = useState('');
    const [reasonDescription, setReasonDescription] = useState('');




    const handleUnsubscribe = async (confirm) => {
        if (!confirm) {
            handleClose();
            return;
        }
    
        if (!selectedReason) {
            alert('Please select a reason for unsubscribing.');
            return;
        }
    
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, user is not authenticated');
            setLoading(false);
            return;
        }
    
        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken._id;
    
            const response = await axios.get(`http://localhost:4000/api/payments/${paymentId}`);
            const paymentData = response.data;
            const subscriptionEndDate = paymentData.paymentInfo.subscriptionEndDate;
    
            if (!subscriptionEndDate) {
                console.error('No subscription end date found');
                setLoading(false);
                return;
            }
    
            const unsubscribeData = {
                userId,
                paymentId,
                subscriptionEndDate,
                reason: selectedReason || 'Reason not provided',
                clientInfo: paymentData.clientInfo,
                vehicleDetails: paymentData.vehicleDetails,
                paymentInfo: paymentData.paymentInfo,
            };
    
            const unsubscribeResponse = await axios.post('http://localhost:4000/api/unsubscribe', unsubscribeData);
    
            if (unsubscribeResponse.data.success) {
                await axios.delete(`http://localhost:4000/api/delete/${paymentId}`);
                console.log('Unsubscribed successfully');
                
                // Send confirmation email
                sendEmail(paymentData.clientInfo.emailAddress, {
                    subscriptionEndDate,
                    reason: selectedReason || 'Reason not provided',
                    clientInfo: paymentData.clientInfo,
                    vehicleDetails: paymentData.vehicleDetails,
                    paymentInfo: paymentData.paymentInfo,
                });
    
                setLoading(false);
                handleClose();
                fetchPlansDetails();
                window.location.reload();
            } else {
                console.error('Error during unsubscribe process');
                setLoading(false);
            }
    
        } catch (error) {
            console.error('Error during unsubscribe process:', error);
            setLoading(false);
        }
    };
    



    // unsubscribe end


    const sendEmail = (email, details) => {
        const { subscriptionEndDate, reason, clientInfo, vehicleDetails, paymentInfo } = details;
    
        const emailData = {
            email: email,
            message: `Subject: Unsubscription Confirmation
    
    Dear ${clientInfo.fullName},
    
    We are writing to confirm that your subscription with Vehicle Insurance Co. has been successfully canceled. Below are the details of your subscription and payment for your reference:
    
    ---
    
    **Reason for Unsubscribing: ${reason}
    
     **Subscription Details:**
    - Subscription End Date: ${subscriptionEndDate}
    
    ### Client Information:
    - Full Name:** ${clientInfo.fullName}
    - Date of Birth: ${clientInfo.dateOfBirth}
    - Identification Number: ${clientInfo.identificationNumber}
    - Contact Number: ${clientInfo.contactNumber}
    - Email Address: ${clientInfo.emailAddress}
    - Permanent Address: ${clientInfo.permanentAddress}
    
    ### Vehicle Details:
    - Registration Number: ${vehicleDetails.registrationNumber}
    - Model: ${vehicleDetails.model}
    - Color: ${vehicleDetails.color}
    - Type: ${vehicleDetails.type}
    - Chassis Number: ${vehicleDetails.chassisNumber}
    - Engine Capacity: ${vehicleDetails.engineCapacity}
    - Fuel Type: ${vehicleDetails.fuelType}
    
    ### Payment Information:
    - Card Holder Name: ${paymentInfo.cardHolderName}
    - Card Number: ${paymentInfo.cardNumber.replace(/\d{12}/, '************')}  
    - Expiry Date: **/**
    - CVV: ***  
    - Price: ${paymentInfo.price}
    - Payment Date: ${paymentInfo.paymentDate}
    - Subscription Status: ${paymentInfo.isExpired ? 'Expired' : 'Active'}
    - Subscription Status: ${paymentInfo.subscriptionEndDate}
    
    ---
    
    Please note, this email serves as an official confirmation of your unsubscription. If you have any further questions or require assistance, feel free to contact our customer support team.
    
    We value your feedback and would greatly appreciate it if you could share your thoughts with us to help improve our services in the future.
    
    Thank you for being with us, and we wish you all the best.
    
    Warm regards,  
    The Finance Team 
    Vehicle Insurance Co.  
    
    ---
    
    **Note: This is an automated email. Please do not reply to this message.
    `,
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
    


    const onDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/delete/${id}`);
            fetchPlansDetails();

        } catch (error) {
            console.error('Error deleting item:', error);

        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleNavigation = (id) => {
        navigate(`/pay-insurance/${id}`);
    };
    

    useEffect(() => {
        fetchPlansDetails();
    }, []);

    const fetchPlansDetails = async () => {
        console.log('LocalStorage:', localStorage);

        const userId = localStorage.getItem('loggedInUserId');
        const storedUserName = localStorage.getItem('loggedInUserName');
        const storedUserEmail = localStorage.getItem('loggedInUserEmail');

        setUserName(storedUserName || ''); // Update state with username
        setUserEmail(storedUserEmail || ''); // Update state with email

        console.log('User ID:', userId);

        if (userId) {
            try {
                const response = await axios.get(`http://localhost:4000/api/payments/non-expired/${userId}`);
                setClientData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else {
            handleError('User ID not found');
        }
    };

    const handleError = (message) => {
        console.error(message); // Handle error appropriately, maybe show an alert or toast
    };

    useEffect(() => {
        console.log('LocalStorage:', localStorage);

        const userId = localStorage.getItem('loggedInUserId');
        const storedUserName = localStorage.getItem('loggedInUserName');
        const storedUserEmail = localStorage.getItem('loggedInUserEmail');

        setUserName(storedUserName || ''); // Update state with username
        setUserEmail(storedUserEmail || ''); // Update state with email

        console.log('User ID:', userId);

        if (userId) {
            axios.get(`http://localhost:4000/api/payments/expired/${userId}`)
                .then(response => {
                    setExpiredPlans(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);

                });
        } else {
            handleError('User ID not found');
        }
    }, []);








    useEffect(() => {
        // Fetch the logged-in user details from localStorage
        console.log('LocalStorage:', localStorage);

        const userId = localStorage.getItem('loggedInUserId');
        const storedUserName = localStorage.getItem('loggedInUserName');
        const storedUserEmail = localStorage.getItem('loggedInUserEmail');

        setUserName(storedUserName || ''); // Update state with username
        setUserEmail(storedUserEmail || ''); // Update state with email

        console.log('User ID:', userId);

        if (userId) {
            axios.get(`http://localhost:4000/api/claim/getclaimbyID/${userId}`)
                .then(response => {
                    setClaimtData(response.data); // Set the fetched claim data
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            console.error('User ID not found');
        }
    }, []);


    const handleNavigationClaim = () => {
        // Navigate to the insurance claim page and pass state to open the modal
        navigate('/insurance-claim', { state: { isVerify: true } });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    return (

        <Box sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: "70px" }}>
            {/* <header>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography variant="h5">Vehicle Insurance Co.</Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ alignSelf: 'flex-end' }}>
                        Logout
                    </Button>
                </Box>
            </header> */}
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginBottom: 2, width: '95%' }}>



                <Box sx={{ marginBottom: 2, boxShadow: 2, padding: 2, borderRadius: 2, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5">Welcome, {userName}</Typography>
                    <Typography variant="h6">Email: {userEmail}</Typography>
                </Box>

                <Grid container spacing={3} sx={{ justifyContent: 'center', marginBottom: "15px", alignItems: 'center', textAlign: "center" }}>
                    {/* Insurance Claim Section */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Box
                            sx={{
                                padding: 2,

                                boxShadow: 3,
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            <Typography variant="h5" sx={{ marginBottom: 2, }}>File an Insurance Claim</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ alignSelf: 'flex-end', '&:hover': { backgroundColor: '#5B6B7C' } }}
                                onClick={handleNavigationClaim}
                            >
                                Go to Insurance Claim
                            </Button>
                        </Box>
                    </Grid>

                    {/* Pay Insurance Section */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Box
                            sx={{
                                padding: 2,

                                boxShadow: 3,
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            <Typography variant="h5" sx={{ marginBottom: 2 }}>Pay Insurance</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ alignSelf: 'flex-end', '&:hover': { backgroundColor: '#5B6B7C' } }}
                                onClick={() => handleNavigation('/pay-insurance')}
                            >
                                Go to Pay Insurance
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <hr
                    style={{
                        marginTop: '20px',
                        border: '0',
                        borderTop: '2px solid #ccc', // Green color, you can change it
                        width: '100%', // Full width
                        opacity: 0.5 // Set transparency
                    }}
                />

                <Container sx={{ marginBottom: 2 }}>
                    <Typography variant="h5">Vehicle Insurance Co.</Typography>

                    <Typography variant="subtitle2" color="textSecondary">
                        Here you can find all the details related to your insurance policies, claims and payments.

                    </Typography>
                </Container>


                <Box>
                    <Box
                        sx={{
                            width: '100%',
                            overflowX: { xs: 'auto' }, // Horizontal scroll for small screens
                            '& .MuiTabs-flexContainer': {
                                flexWrap: { xs: 'nowrap', sm: 'wrap' },
                                justifyContent: { xs: 'flex-start', sm: 'center' },
                            },
                        }}
                    >
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Registered Insurance Plans" />
                            <Tab label="Claim Information" />
                            <Tab
                                label={
                                    <Badge
                                        color="error"
                                        variant="dot"
                                        invisible={expiredPlans.length === 0}
                                    >
                                        The Insurance Plan Needs to be Renewed
                                    </Badge>
                                }
                            />
                            <Tab label="Vehicle Insurance Policies" />
                        </Tabs>
                    </Box>


                    {value === 0 && (
                        <div style={{ padding: '20px' }}>
                            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                                Vehicle Insurance Plans
                            </Typography>

                            {clientData.length === 0 ? (
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    No active plans yet...
                                </Typography>
                            ) : (
                                <Grid container spacing={4} sx={{ marginTop: 0 }}>
                                    {clientData.map((client, index) => {
                                        // Ensure paymentInfo is available in each client object
                                        const paymentInfo = client.paymentInfo; // Access paymentInfo directly

                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                <Paper sx={{ padding: 2, marginBottom: 2 }}>
                                                    <Typography variant="h5">Owner Information</Typography>
                                                    <Typography>Name: {client.clientInfo.fullName}</Typography>
                                                    <Typography>Email: {client.clientInfo.emailAddress}</Typography>
                                                    <Typography>Contact Number: {client.clientInfo.contactNumber}</Typography>
                                                    <Typography>Address: {client.clientInfo.permanentAddress}</Typography>
                                                    <br />
                                                    <Typography variant="h5">Vehicle Details</Typography>
                                                    <Typography>Registration Number: {client.vehicleDetails.registrationNumber}</Typography>
                                                    <Typography>Model: {client.vehicleDetails.model}</Typography>
                                                    <Typography>Color: {client.vehicleDetails.color}</Typography>
                                                    <Typography>Type: {client.vehicleDetails.type}</Typography>
                                                    <Typography>Chassis Number: {client.vehicleDetails.chassisNumber}</Typography>
                                                    <br />
                                                    <Typography variant="h5">Payment Information</Typography>
                                                    <Typography>Price: {paymentInfo?.price || "N/A"}</Typography> {/* Show N/A if price is missing */}

                                                    {/* Only show unsubscribe button if paymentInfo is available */}
                                                    {paymentInfo ? (
                                                        <>
                                                            {/* <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{ marginTop: 2 }}
                                                                onClick={() => onDelete(client._id)} // Pass the ObjectId here
                                                            >
                                                                Unsubscribe The plan
                                                            </Button> */}
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{ marginTop: 2 }}
                                                                onClick={() => handleOpen(client._id)}
                                                            >
                                                                Unsubscribe from Insurance Plan
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Typography sx={{ color: 'text.secondary', marginTop: 2 }}>
                                                            No payment information available.
                                                        </Typography>
                                                    )}
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}
                        </div>
                    )}



                    {value === 1 && (
                        <div style={{ padding: '20px' }}>
                            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                                Vehicle Claimes
                            </Typography>
                            {claimtData.length === 0 ? (
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    No claimes had been added...
                                </Typography>
                            ) : (
                                <Grid container spacing={4} sx={{ marginTop: 0 }}>
                                    {claimtData.map((claim, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                                                <Typography variant="h5">Owner Information</Typography>
                                                <Typography>Name: {claim.fullName}</Typography> {/* Corrected */}
                                                {/* Assuming claim has an email */}
                                                <Typography>Contact Number: {claim.contactNumber}</Typography>
                                                <Typography>PolicyNumber: {claim.policyNumber}</Typography>
                                                <br />
                                                <Typography variant="h5">Claim Details</Typography>
                                                <Typography>Claim ID: {claim.claimId}</Typography>
                                                <Typography>Policy Number: {claim.policyNumber}</Typography>
                                                <Typography>Incident Date: {claim.incidentDate}</Typography>
                                                <Typography>Claim Amount: {claim.claimAmount}</Typography>
                                                <Typography>Description: {claim.description}</Typography>
                                                <Grid container spacing={0} sx={{ marginTop: '10px' }}>
                                                    {claim.uploadedURLs.map((imageUrl, index) => (
                                                        <Grid item xs={12} sm={6} md={4} key={index}>

                                                            <img
                                                                src={imageUrl}
                                                                alt={`Claim Image ${index + 1}`}
                                                                style={{ width: '110px', height: '90px', borderRadius: '8px' }}
                                                            />

                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </div>
                    )}
                    {value === 2 && (
                        <div style={{ padding: '20px' }}>
                            <Badge
                                color="error"
                                variant="dot"
                                invisible={expiredPlans.length === 0} // Hide the dot if no expired plans
                                sx={{ marginRight: 1 }}
                            />
                            <Typography variant="h4" sx={{ marginBottom: 2 }} >

                                I have to renew the insurance plan

                            </Typography>

                            {expiredPlans.length === 0 ? (
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    No expired plans yet...
                                </Typography>
                            ) : (
                                <Grid container spacing={4} sx={{ marginTop: 0 }}>
                                    {expiredPlans.map((client, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                                                <Typography variant="h5">Owner Information</Typography>
                                                <Typography>Name: {client.clientInfo.fullName}</Typography>
                                                <Typography>Email: {client.clientInfo.emailAddress}</Typography>
                                                <Typography>Contact Number: {client.clientInfo.contactNumber}</Typography>
                                                <Typography>Address: {client.clientInfo.permanentAddress}</Typography>
                                                <br />
                                                <Typography variant="h5">Vehicle Details</Typography>
                                                <Typography>Registration Number: {client.vehicleDetails.registrationNumber}</Typography>
                                                <Typography>Model: {client.vehicleDetails.model}</Typography>
                                                <Typography>Color: {client.vehicleDetails.color}</Typography>
                                                <Typography>Type: {client.vehicleDetails.type}</Typography>
                                                <Typography>Chassis Number: {client.vehicleDetails.chassisNumber}</Typography>
                                                <br />
                                                <Typography variant="h5">Payment Information</Typography>
                                                <Typography>Price: {client.paymentInfo.price}</Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ marginTop: 2 }}
                                                    onClick={() => handleNavigation(client._id)} // Pass the ObjectId here
                                                >
                                                    Renew The Plan
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </div>
                    )}
                    {value === 3 && (
                        <div style={{ padding: '20px' }}>
                            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                                Sri Lanka Vehicle Insurance Policies
                            </Typography>
                            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                Types of Insurance Policies
                            </Typography>
                            <ul>
                                <li>
                                    <Typography variant="body1">
                                        <strong>Third-Party Liability Insurance:</strong> This policy is mandatory in Sri Lanka and covers damages to third-party property and injury to third-party individuals caused by your vehicle.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">
                                        <strong>Comprehensive Insurance:</strong> Provides extensive coverage, including damage to your own vehicle, third-party liability, and coverage for theft, natural disasters, and other risks.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">
                                        <strong>Personal Accident Cover:</strong> Offers financial compensation in the event of injury or death of the driver due to an accident.
                                    </Typography>
                                </li>
                            </ul>

                            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                                Key Features
                            </Typography>
                            <ul>
                                <li>
                                    <Typography variant="body1">
                                        Coverage for accidental damage, theft, and third-party liability.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">
                                        Add-on options such as zero depreciation, roadside assistance, and engine protection.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">
                                        Cashless claims at network garages.
                                    </Typography>
                                </li>
                            </ul>

                            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                                Claim Process
                            </Typography>
                            <ol>
                                <li>
                                    <Typography variant="body1">
                                        Notify your insurance provider immediately after an accident or damage.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">
                                        Submit necessary documents, such as a claim form, copy of the insurance policy, driving license, and police report.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">
                                        The insurer will assess the damage and process the claim based on the policy terms.
                                    </Typography>
                                </li>
                            </ol>

                            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                                Important Tips
                            </Typography>
                            <ul>
                                <li>
                                    <Typography variant="body1">
                                        Compare policies from different insurers to get the best coverage at a competitive premium.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">
                                        Read the policy documents carefully to understand the inclusions, exclusions, and claim process.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body1">
                                        Keep your vehicle in good condition and drive responsibly to avoid accidents.
                                    </Typography>
                                </li>
                            </ul>
                        </div>
                    )}

                </Box>
                <Modal open={open} onClose={handleClose}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={modalTitleStyle}>
                            Are you sure you want to unsubscribe the insurance plan?
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                            Please select a reason for unsubscribing:
                        </Typography>
                        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                            <InputLabel id="reason-select-label">Reason</InputLabel>
                            <Select
                                labelId="reason-select-label"
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                label="Reason"
                            >
                                <MenuItem value="High premiums">High premiums</MenuItem>
                                <MenuItem value="Found a better plan elsewhere">Found a better plan elsewhere</MenuItem>
                                <MenuItem value="No longer need insurance">No longer need insurance</MenuItem>
                                <MenuItem value="Dissatisfied with customer service">Dissatisfied with customer service</MenuItem>
                                <MenuItem value="Coverage not sufficient">Coverage not sufficient</MenuItem>
                                <MenuItem value="Financial difficulties">Financial difficulties</MenuItem>
                                <MenuItem value="Switching to a different provider">Switching to a different provider</MenuItem>
                                <MenuItem value="Policy terms are not clear">Policy terms are not clear</MenuItem>
                                <MenuItem value="Unexpected fees or charges">Unexpected fees or charges</MenuItem>
                                <MenuItem value="Other reasons">Other reasons</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={modalActionsStyle}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleUnsubscribe(false)}
                                sx={{ width: '120px' }}
                            >
                                No
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleUnsubscribe(true)}
                                disabled={loading}
                                sx={{ width: '120px' }}
                            >
                                {loading ? 'Processing...' : 'Yes'}
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                <ToastContainer />
            </Paper>
        </Box>


    );
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    outline: 'none',
};

const modalTitleStyle = {
    fontWeight: '600',
    fontSize: '20px',
    marginBottom: '20px',
    color: 'black', // Corrected to 'color' instead of 'colors'
};


const modalActionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
};

export default Home;
