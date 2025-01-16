import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Alert, CircularProgress, Paper } from '@mui/material';
import axios from 'axios';

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        about: '',
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the form is being submitted
        setStatus(''); // Reset the previous status

        try {
            const response = await axios.post('http://localhost:4000/api/send-email/contactUs', formData);
            if (response.status === 200) {
                setStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    message: '',
                    about: '',
                });
            }
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false); // Set loading to false when the request is finished
        }
    };

    return (
        <Box sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            marginTop: "70px",
            padding: '20px',
            borderRadius: '8px',
        }}>
            <Paper elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    marginBottom: 4,
                    width: '95%',
                    maxWidth: '1500px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    
                }}>
                    <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 4, fontWeight: 'bold',  }}>
                Contact Us
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: 4,  }}>
                Have questions or need assistance? Get in touch with us, and we’ll be happy to help!
            </Typography>
            <Grid container spacing={4}>
                
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                        marginBottom: 2,
                        
                        textAlign: 'left'
                    }}>
                        Get in Touch
                    </Typography>

                    <Typography variant="body1" sx={{
                        marginBottom: 2,
                        
                        lineHeight: 1.7
                    }}>
                        <strong>Phone:</strong> <b>+1 800-555-1234</b> <br />
                        <strong>Email:</strong> <b>support@easyconnect.com</b> <br />
                        <strong>Address:</strong> <b>123 Insurance Lane, Cityville, State, Country</b>
                    </Typography>

                    <Typography variant="h6" sx={{
                        fontWeight: 'bold',
                        marginTop: 4,
                        
                    }}>
                        Business Hours
                    </Typography>
                    
                    <Typography variant="h6" sx={{
                        fontWeight: 'bold',
                        marginTop: 4,
                        
                    }}>
                        Frequently Asked Questions (FAQ)
                    </Typography>
                    <Typography variant="body1" sx={{
                        marginBottom: 2,
                        
                        lineHeight: 1.7
                    }}>
                        <strong>Q:</strong> What is the best way to contact support? <br />
                        <strong>A:</strong> You can reach us by phone or email, and we'll get back to you as soon as possible. <br />
                        <strong>Q:</strong> Do you offer international support? <br />
                        <strong>A:</strong> Yes, we offer 24/7 support for our global customers. Please use the contact methods listed above.
                    </Typography>

                    <Typography variant="h6" sx={{
                        fontWeight: 'bold',
                        marginTop: 4,
                        
                    }}>
                        Follow Us
                    </Typography>
                    <Typography variant="body1" sx={{
    marginBottom: 2,
    lineHeight: 1.7,
    '& a': {
        color: '#2a9d8f', // Make the links green
        textDecoration: 'none', // Remove underline
        '&:hover': {
            textDecoration: 'underline', // Add underline on hover
        }
    }
}}>
    <strong>Facebook:</strong> <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">facebook.com/vehicleinsuranceco.</a><br />
    <strong>Twitter:</strong> <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">twitter.com/vehicleinsuranceco.</a><br />
    <strong>Instagram:</strong> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">instagram.com/vehicleinsuranceco.</a>
</Typography>

                </Grid>

                
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                        Send Us a Message
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="About"
                            variant="outlined"
                            fullWidth
                            required
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Message"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            required
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            sx={{ marginBottom: 2 }}
                        />
                        <Box sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            borderRadius: '8px',
                        }}>
                             {status === 'success' && <Alert severity="success" sx={{ marginBottom: 2 }}>Your message was sent successfully!</Alert>}
                             {status === 'error' && <Alert severity="error" sx={{ marginBottom: 2 }}>There was an error sending your message. Please try again.</Alert>}
                             {loading && <Alert severity="info" sx={{ marginBottom: 2 }}>Your message is sending...</Alert>} {/* Show sending message */}
                            <Button variant="contained" color="primary" type="submit" sx={{ padding: '12px 24px', fontWeight: 'bold' }}>
                                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Message'}
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Grid>

            </Paper>
        </Box>
    );
}

export default ContactUs;
