import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';

function Services() {
    const services = [
        {
            title: 'Accident Assistance Services',
            description: 'Receive immediate support during accidents, including guidance on filing claims, roadside assistance, and emergency towing services.',
            image: 'https://images.pexels.com/photos/7640773/pexels-photo-7640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
            title: 'Flexible Payment Options',
            description: 'Choose from multiple payment methods for your convenience, including installments and auto-renewal options.',
            image: 'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
            title: 'Vehicle Insurance Enrollment',
            description: 'Easily start your vehicle insurance policy online with just a few clicks. Compare plans and choose the best fit for your needs.',
            image: 'https://images.pexels.com/photos/10341357/pexels-photo-10341357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
            title: 'Online Claim Processing',
            description: 'File claims online and track their status in real-time. We ensure a seamless process from submission to resolution.',
            image: 'https://images.pexels.com/photos/3987020/pexels-photo-3987020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
            <Typography
                variant="h3"
                sx={{
                    textAlign: 'center',
                    marginBottom: 4,
                    fontWeight: 'bold',
                    
                    fontSize: { xs: '2rem', md: '2.5rem' },
                }}
            >
                Our Services
            </Typography>
            <Grid container spacing={4} sx={{ maxWidth: '1200px' }}>
                {services.map((service, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={service.image}
                                    alt={service.title}
                                    sx={{
                                        filter: 'brightness(90%)',
                                        '&:hover': { filter: 'brightness(100%)' },
                                    }}
                                />
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 'bold',
                                            marginBottom: 2,
                                           
                                            textAlign: 'center',
                                        }}
                                    >
                                        {service.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            lineHeight: 1.8,
                                            
                                            textAlign: 'center',
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        {service.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Services;
