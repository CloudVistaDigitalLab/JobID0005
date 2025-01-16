import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { TextField, Button, Container, Typography, Grid, Box,Card } from '@mui/material';
import { handleError, handleSuccess } from '../utils';

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email, and password are required');
        }
        try {
            const url = `${process.env.REACT_APP_API_URL}/auth/signup`;
            console.log('Signup URL:', url);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupInfo),
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    };

    return (
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',}}>
        
        <Card sx={{ padding: 3, width: '100%', maxWidth: 400 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Signup
                </Typography>
                <form onSubmit={handleSignup}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                name="name"
                                value={signupInfo.name}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                name="email"
                                type="email"
                                value={signupInfo.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                variant="outlined"
                                fullWidth
                                name="password"
                                type="password"
                                value={signupInfo.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" fullWidth type="submit">
                                Signup
                            </Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link to="/login">Login</Link>
                        </Typography>
                    </Box>
                </form>
                <ToastContainer />
                </Card>
        </Box>
       
    );
}

export default Signup;
