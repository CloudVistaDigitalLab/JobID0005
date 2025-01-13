import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { Button, Typography, Box, Grid, Paper, Container } from '@mui/material';
import axios from 'axios';

function Home() {
    const [clientData, setClientData] = useState([]);
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

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

                <Grid container spacing={3} sx={{ justifyContent: 'center',marginBottom:"15px",alignItems:'center',textAlign:"center" }}>
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
                                sx={{ alignSelf: 'flex-end','&:hover': { backgroundColor: '#5B6B7C' } }}
                                onClick={() => handleNavigation('/insurance-claim')}
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
                                sx={{ alignSelf: 'flex-end' ,'&:hover': { backgroundColor: '#5B6B7C' }}}
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
                    <Typography variant="subtitle1" color="textSecondary">
                        Your Insurance Plans for Your Vehicles
                    </Typography>
                </Container>


                <Grid container spacing={4}>

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

                <ToastContainer />
            </Paper>
        </Container>

    );
}

export default Home;
