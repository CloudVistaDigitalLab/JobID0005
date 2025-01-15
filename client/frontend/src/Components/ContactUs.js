import React from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';

function ContactUs() {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 4, fontWeight: 'bold' }}>
                Contact Us
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: 4, color: '#555' }}>
                Have questions or need assistance? Get in touch with us, and we’ll be happy to help!
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                        Get in Touch
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        Phone: <b>+1 800-555-1234</b> <br />
                        Email: <b>support@easyconnect.com</b> <br />
                        Address: <b>123 Insurance Lane, Cityville, State, Country</b>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                        Send Us a Message
                    </Typography>
                    <form>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Message"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            required
                            sx={{ marginBottom: 2 }}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Send Message
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ContactUs;
