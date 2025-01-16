import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Box, Grid, Paper } from '@mui/material';

const UnsubscribedActivePlans = () => {
    const [plans, setPlans] = useState([]);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const userId = localStorage.getItem('loggedInUserId');

    useEffect(() => {
        if (!userId) {
            console.error('User ID not found. Please log in.');
            return; 
        }

        // Fetch user details from local storage
        const storedUserName = localStorage.getItem('loggedInUserName');
        const storedUserEmail = localStorage.getItem('loggedInUserEmail');
        setUserName(storedUserName || '');
        setUserEmail(storedUserEmail || '');

        const fetchPlans = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/unsubscribedPlans/${userId}`);
                const activePlans = response.data.filter(plan => {
                    const subscriptionEndDate = new Date(plan.subscriptionEndDate);
                    const unsubscribeDate = new Date(plan.unsubscribeDate);
                    return unsubscribeDate < subscriptionEndDate;
                });
                setPlans(activePlans);
            } catch (error) {
                console.error('Error fetching unsubscribed plans:', error);
            }
        };

        fetchPlans();
    }, [userId]);


    return (
        <Box sx={{ marginTop: 10, marginLeft: 5, marginRight: 5 }}>


            {userId ? (
                <Box sx={{ padding: 0, borderRadius: '8px', boxShadow: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#F09A10', textTransform: 'uppercase' }}>
                        Unsubscribed but Active Plans
                    </Typography>

                    <Typography variant="body1" sx={{ textAlign: 'center' }}><strong>Hello, </strong> {userName}</Typography>

                </Box>
            ) : (
                <Typography variant="body1" color="error" sx={{ textAlign: 'center', marginTop: 3 }}>
                    Error: User not logged in.
                </Typography>
            )}

            {plans.length > 0 ? (
                <Grid container spacing={3} sx={{ marginTop: 0, marginBottom: "30px" }}>
                    {plans.map(plan => {
                        const unsubscribeDate = new Date(plan.unsubscribeDate);
                        const subscriptionEndDate = new Date(plan.subscriptionEndDate);

                        
                        const diffTime = subscriptionEndDate - unsubscribeDate;

                        
                        const activeDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        return (
                            <Grid item xs={12} sm={6} md={4} key={plan._id}>
                                <Paper sx={{ padding: 2, borderRadius: '8px', boxShadow: 3 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box variant="outlined" sx={{

                                                borderRadius: '16px',
                                                padding: '10px',


                                            }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Plan Details</Typography>


                                                <Typography variant="body1">
                                                    <strong>Subscription End Date : </strong>
                                                    {new Date(plan.subscriptionEndDate).toISOString().split('T')[0]}
                                                </Typography>

                                                <Typography variant="body1" sx={{ color: '#F01010' }}><strong>{activeDays} days more</strong></Typography>
                                            </Box>


                                            <Box sx={{ marginBottom: 2, boxShadow: 2, padding: 2, borderRadius: 2, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Client Info</Typography>
                                                <List sx={{ paddingLeft: 0 }}>
                                                    {Object.entries(plan.clientInfo).map(([key, value]) => (
                                                        <React.Fragment key={key}>
                                                            <Divider sx={{ marginY: -0.5 }} />
                                                            <ListItem sx={{ paddingLeft: 0 }}>
                                                                <ListItemText primary={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value || 'N/A'}`} />
                                                            </ListItem>
                                                        </React.Fragment>
                                                    ))}
                                                </List>
                                            </Box>


                                            <Box sx={{ marginBottom: 2, boxShadow: 2, padding: 2, borderRadius: 2, }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>Vehicle Details</Typography>
                                                <List sx={{ paddingLeft: 0 }}>
                                                    {Object.entries(plan.vehicleDetails).map(([key, value]) => (
                                                        <React.Fragment key={key}>
                                                            <Divider sx={{ marginY: -0.5 }} />
                                                            <ListItem sx={{ paddingLeft: 0 }}>
                                                                <ListItemText primary={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value || 'N/A'}`} />
                                                            </ListItem>
                                                        </React.Fragment>
                                                    ))}
                                                </List>
                                            </Box>

                                            <Divider sx={{ marginY: 1 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>Payment Info</Typography>
                                            <List sx={{ paddingLeft: 0 }}>
                                                <ListItem sx={{ paddingLeft: 0, textAlign: 'center' }}>
                                                    <ListItemText primary={`Price: ${plan.paymentInfo?.price || 'N/A'}`} />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>

            ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 3 }}>
                    No active unsubscribed plans found...
                </Typography>
            )}
        </Box>
    );
};

export default UnsubscribedActivePlans;
