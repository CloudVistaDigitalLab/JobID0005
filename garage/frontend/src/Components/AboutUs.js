import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

function AboutUs() {
    return (
        <Box
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                marginTop: "70px",
                
                padding: '20px',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    marginBottom: 4,
                    width: '95%',
                    maxWidth: '1200px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'center',
                        marginBottom: 4,
                        fontWeight: 'bold',
                        
                    }}
                >
                    About Us
                </Typography>
                <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src="https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=600"
                            alt="About Us"
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 1.8,
                                
                                fontSize: '1rem',
                            }}
                        >
                            Welcome to our vehicle insurance platform, your trusted partner in safeguarding your vehicles and ensuring peace of mind. 
                            We are dedicated to providing you with exceptional service by connecting you with top-tier insurance providers, offering 
                            transparent, reliable, and user-centric solutions.
                        </Typography>
                        
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 1.8,
                                marginTop: 2,
                                
                                fontSize: '1rem',
                            }}
                        >
                            At the heart of our service is a commitment to excellence and customer satisfaction. We understand the unique challenges 
                            of vehicle ownership and strive to provide solutions that are tailored to your lifestyle. Our platform simplifies the 
                            insurance process, enabling you to enroll in plans effortlessly, submit claims with ease, and receive timely support 
                            whenever you need it.
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 1.8,
                                marginTop: 2,
                                
                                fontSize: '1rem',
                            }}
                        >
                            As a vehicle insurance company, we value trust, transparency, and innovation. We continuously work to enhance your 
                            experience by leveraging the latest technology to bring you intuitive features and personalized services. Our goal 
                            is to make vehicle insurance accessible to everyone, so you can drive with confidence knowing that your protection 
                            is in capable hands.
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 1.8,
                                marginTop: 2,
                                
                                fontSize: '1rem',
                            }}
                        >
                            Thank you for choosing us as your vehicle insurance partner. We look forward to serving you and exceeding your expectations.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    marginBottom: 4,
                    width: '95%',
                    maxWidth: '1200px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: 'center',
                        marginBottom: 4,
                        fontWeight: 'bold',
                        
                    }}
                >
                    Our Vision
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.8,
                        
                        fontSize: '1.1rem',
                        textAlign: 'center',
                    }}
                >
                    To be the most trusted and innovative vehicle insurance platform, empowering individuals and businesses with 
                    simple, transparent, and reliable solutions for all their insurance needs.
                </Typography>
            </Paper>

            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    marginBottom: 4,
                    width: '95%',
                    maxWidth: '1200px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: 'center',
                        marginBottom: 4,
                        fontWeight: 'bold',
                       
                    }}
                >
                    Our Mission
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.8,
                       
                        fontSize: '1.1rem',
                        textAlign: 'center',
                    }}
                >
                    To simplify and enhance the vehicle insurance process by offering customer-centric solutions, leveraging the latest technologies, 
                    and providing exceptional support to ensure safety, trust, and satisfaction for every client we serve.
                </Typography>
            </Paper>
        </Box>
    );
}

export default AboutUs;
