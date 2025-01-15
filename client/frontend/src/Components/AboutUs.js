import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

function AboutUs() {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 4, fontWeight: 'bold' }}>
                About Us
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <img
                        src="https://via.placeholder.com/600x400?text=About+Us+Image"
                        alt="About Us"
                        style={{ width: '100%', borderRadius: 8 }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Welcome to our vehicle insurance platform, where we connect you to trusted insurance companies, 
                        offering a streamlined and user-friendly experience to manage your insurance needs. We aim to make 
                        vehicle insurance simple, transparent, and accessible for everyone.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, marginTop: 2 }}>
                        Our platform allows you to compare policies from leading insurance providers, enroll in the plan 
                        that suits your needs, and manage claims effortlessly. We focus on delivering quick, reliable, and 
                        comprehensive solutions tailored to your preferences.
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AboutUs;
