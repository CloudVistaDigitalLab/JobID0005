import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import LoadingScreen from '../Components/LoadingScreen';
import { Box, Typography } from '@mui/material';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.redirectTo || '/';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;

        setLoginInfo(copyLoginInfo);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        try {
            const url = `${process.env.REACT_APP_API_URL}/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, userId, name, email, error } = result;

            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUserId', userId);
                localStorage.setItem('loggedInUserName', name);
                localStorage.setItem('loggedInUserEmail', email);
                setIsLoggedIn(true);

                setTimeout(() => {
                    navigate(redirectTo);
                }, 5000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',}}>
            <Card sx={{ padding: 3, width: '100%', maxWidth: 400 }}>
                {isLoggedIn ? (
                    <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                        <Typography variant="h5">
                            {`Welcome, ${localStorage.getItem('loggedInUserName')}`}
                        </Typography>
                        <LoadingScreen />
                    </Box>
                ) : (
                    <form onSubmit={handleLogin}>
                        <Typography variant="h4" gutterBottom align="center">Login</Typography>
                        
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            onChange={handleChange}
                            type="email"
                            name="email"
                            value={loginInfo.email}
                            required
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            onChange={handleChange}
                            type="password"
                            name="password"
                            value={loginInfo.password}
                            required
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
                            Login
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Doesn&apos;t have an account?{' '}
                                <Link to="/signup">Signup</Link>
                            </Typography>
                        </Box>
                    </form>
                )}

                <ToastContainer />
            </Card>
        </Box>
    );
}

export default Login;
