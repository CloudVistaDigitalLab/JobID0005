import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { Button, Typography, Box, Grid, Paper, Container, Tab, Tabs } from '@mui/material';
import axios from 'axios';

function Home() {
    const [clientData, setClientData] = useState([]);
    const [claimtData, setClaimtData] = useState([]);
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [value, setValue] = React.useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleNavigation = (path) => {
        navigate(path);
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
            axios.get(`http://localhost:4000/api/user-payments/${userId}`)
                .then(response => {
                    setClientData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    handleError('Failed to fetch data');
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
        <Container sx={{ marginTop: 10, marginBottom: 5 }}>
            {/* <header>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography variant="h5">Vehicle Insurance Co.</Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ alignSelf: 'flex-end' }}>
                        Logout
                    </Button>
                </Box>
            </header> */}
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>



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
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Registerd Insurance plans" />
                        <Tab label="Claim Information" />
                        <Tab label="Vehicle Insurance Policies" />
                    </Tabs>

                    {/* Conditionally render content based on the active tab */}
                    {value === 0 && (
                        <div style={{ padding: '20px' }}>
                            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                                 Vehicle Insurance Plans
                            </Typography>
                            <Grid container spacing={4} sx={{ marginTop: 0 }}>
                            {clientData.map((client, index) => (
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
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        </div>
                    )}

                    {value === 1 && (
                        <div style={{ padding: '20px' }}>
                            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                                 Vehicle Claimes
                            </Typography>
                            <Grid container spacing={4} sx={{ marginTop: 0 }}>
                                {claimtData.map((claim, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Paper sx={{ padding: 2, marginBottom: 2 }}>
                                            <Typography variant="h5">Owner Information</Typography>
                                            <Typography>Name: {claim.fullName}</Typography> {/* Corrected */}
                                            <Typography>Email: {claim.email}</Typography> {/* Assuming claim has an email */}
                                            <Typography>Contact Number: {claim.contactNumber}</Typography>
                                            <Typography>Address: {claim.address}</Typography>
                                            <br />
                                            <Typography variant="h5">Claim Details</Typography>
                                            <Typography>Claim ID: {claim.claimId}</Typography>
                                            <Typography>Policy Number: {claim.policyNumber}</Typography>
                                            <Typography>Incident Date: {claim.incidentDate}</Typography>
                                            <Typography>Claim Amount: {claim.claimAmount}</Typography>
                                            <Typography>Description: {claim.description}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    )}
                    {value === 2 && (
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




                <ToastContainer />
            </Paper>
        </Container>

    );
}

export default Home;
