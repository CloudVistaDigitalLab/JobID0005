import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
    const navigate = useNavigate(); // Initialize the navigate function

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Replace with your actual authentication check

    const handleSubmitQuotationClick = () => {
        // If the user is not logged in, redirect to the login page
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to the login page using navigate
        } else {
            navigate('/home'); // Redirect to the home page if logged in
        }
    };

    return (
        <Box
            sx={{
                marginTop: '10px',
                minHeight: '100vh',
                paddingTop: '50px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {/* Hero Section */}
            <Box
                sx={{
                    backgroundImage: `url('https://images.pexels.com/photos/331988/pexels-photo-331988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '60px',
                    color: 'white',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Welcome to Vehicle Insurance Co.
                </Typography>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    Your Trusted Partner for Vehicle Protection and Recovery
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    href="#nextSteps"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#DCA056', // Change the background color on hover
                            transform: 'scale(1.05)', // Optional: adds a slight scaling effect on hover
                            transition: 'all 0.3s ease', // Smooth transition for the hover effect
                        }
                    }}
                >
                    Get Started
                </Button>
            </Box>

            {/* Next Steps Section */}
            <Container maxWidth="lg" sx={{ marginTop: 5, paddingBottom: 5 }}>
                <Typography variant="h3" align="center" sx={{ marginBottom: 3 }}>
                    What to Do After an Accident
                </Typography>
                <Typography variant="h5" align="center" sx={{ marginBottom: 3 }}>
                    Follow these steps after an accident to submit a quotation and ensure a smooth claims process.
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Step 1: Report the Accident to Authorities
                            </Typography>
                            <Typography variant="body1">
                                Immediately after the accident, ensure the safety of all individuals involved. Report the incident to the relevant authorities, such as the police, and obtain an official report. This will be necessary to verify the details of the accident and proceed with your insurance claim. Keep a copy of the police report for future reference.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Step 2: Visit the Garage for Vehicle Assessment
                            </Typography>
                            <Typography variant="body1">
                                After reporting the accident to the authorities, take your vehicle to an authorized garage for inspection and assessment. The garage will evaluate the extent of the damage, and their team will prepare a detailed quotation based on the required repairs. Ensure that all damages are thoroughly documented for insurance purposes.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Step 3: Upload the Quotation to Your Insurance Company
                            </Typography>
                            <Typography variant="body1">
                                Once the garage has completed the repair estimate and prepared the quotation, you need to submit it to your insurance company. This can be done through their online portal or via email, along with any other supporting documents they may require, such as photos of the damage, your police report, and vehicle details. Make sure all documents are clear and legible to expedite the approval process.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Step 4: Insurance Review and Claim Settlement
                            </Typography>
                            <Typography variant="body1">
                                After submitting the quotation and supporting documents, the insurance company will review your claim and the repair estimate. If everything is in order, they will approve your claim. Once approved, they will arrange for the claim settlement according to your policy’s terms, and the necessary repairs will proceed.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

            </Container>

            {/* Call to Action Section */}
            <Box
                id="nextSteps"
                sx={{
                    marginTop: '15px',
                    backgroundColor: '#074E49',
                    padding: '50px 0',
                    width: '100%',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Ready to Get Started?
                </Typography>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    We’re here to help you every step of the way. Click the button below to submit your <strong style={{ color: '#FFA203' }}>Quatation</strong> details.
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleSubmitQuotationClick} // OnClick event now uses navigate
                    sx={{
                        '&:hover': {
                            backgroundColor: '#DCA056',
                            transform: 'scale(1.05)',
                            transition: 'all 0.3s ease',
                        },
                    }}
                >
                    Submit Quotation
                </Button>
            </Box>
        </Box>
    );
}

export default WelcomePage;
