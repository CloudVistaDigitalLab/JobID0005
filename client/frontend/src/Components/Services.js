import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

function Services() {
    const services = [
        {
            title: 'Vehicle Insurance Enrollment',
            description: 'Easily start your vehicle insurance policy online with just a few clicks. Compare plans and choose the best fit for your needs.',
            image: 'https://images.pexels.com/photos/10341357/pexels-photo-10341357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
            title: 'Online Claim Processing',
            description: 'File claims online and track their status in real-time. We ensure a seamless process from submission to resolution.',
            image: 'https://images.pexels.com/photos/4199526/pexels-photo-4199526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
            title: 'Policy Comparison',
            description: 'Access a wide range of insurance plans from leading providers. Compare features, coverage, and pricing to make informed decisions.',
            image: 'https://images.pexels.com/photos/259006/pexels-photo-259006.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
            title: 'Dedicated Support',
            description: 'Our team of experts is available to assist you at every step. From enrollment to claims, we’ve got you covered.',
            image: 'https://images.pexels.com/photos/5453836/pexels-photo-5453836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
    ];

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 4, fontWeight: 'bold' }}>
                Our Services
            </Typography>
            <Grid container spacing={4}>
                {services.map((service, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: '100%' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={service.image}
                                alt={service.title}
                            />
                            <CardContent>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                    {service.title}
                                </Typography>
                                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                    {service.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Services;
