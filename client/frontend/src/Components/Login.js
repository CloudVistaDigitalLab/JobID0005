import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import LoadingScreen from '../Components/LoadingScreen';

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
        // Check if user is logged in by checking the presence of the token in localStorage
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
            const { success, message, jwtToken, userId, name,email, error } = result; // Use userId instead of name or user._id

            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUserId', userId); // Store userId separately
                localStorage.setItem('loggedInUserName', name); // Store username separately
                localStorage.setItem('loggedInUserEmail', email); // Store email separately
                // Set logged in state
                setIsLoggedIn(true);

                setTimeout(() => {
                    // Navigate to the page based on the `redirectTo` value
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

    // const handleLogout = () => {
    //     // Clear user data from localStorage and update the state
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('loggedInUser');
    //     setIsLoggedIn(false);
    //     navigate('/'); // Redirect to the home page or login page
    // };

    return (
        <Card className='container'>


            {isLoggedIn ? (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <h1 >{isLoggedIn ? 'Welcome, ' + localStorage.getItem('loggedInUserName') : 'Login'}</h1>
                    <LoadingScreen />
                </div>
            ) : (
                <form onSubmit={handleLogin}>
                    <div>
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            onChange={handleChange}
                            type='email'
                            name='email'
                            value={loginInfo.email}
                            required
                            sx={{ width: '100%' }}
                        />
                    </div>
                    <br />
                    <div>
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            onChange={handleChange}
                            type='password'
                            name='password'
                            value={loginInfo.password}
                            required
                            sx={{ width: '100%' }}
                        />
                    </div>
                    <br />
                    <Button type='submit' variant="contained">Login</Button>
                    <br />
                    <br />
                    <div>Doesn't have an account?
                        <Link to="/signup">Signup</Link>
                    </div>
                </form>
            )}

            <ToastContainer />
        </Card>
    );
}

export default Login;
