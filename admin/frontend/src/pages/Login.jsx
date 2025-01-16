import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


function Login() {

    const [openSnack, setOpenSnack] = React.useState(false);
    const [snackMsg, setSnackMsg] = React.useState('');

    const handleClickSnack = () => {
        setOpenSnack(true);
    };

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpenSnack(false);
    };

    const action = (
        <React.Fragment>
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnack}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
        </React.Fragment>
    );

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return setSnackMsg('email and password are required')
            handleClickSnack();
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
            const { success, message, jwtToken, name, error, email } = result;
            if (success) {
                setSnackMsg(message);
                handleClickSnack();
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('loggedInUserEmail', email);
                localStorage.setItem("currentPath", "/dashboard")
                setTimeout(() => {
                    navigate('/dashboard')
                }, 3000)
            } else if (error) {
                const details = error?.details[0].message;
                setSnackMsg(details);
                handleClickSnack();
            } else if (!success) {
                setSnackMsg(message);
                handleClickSnack();
            }
            console.log(result);
        } catch (err) {
            setSnackMsg(err);
            handleClickSnack();
        }
    }

    return (
        <Card className='container'>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
                message={snackMsg}
                action={action}
                />
            <h1>Login</h1>
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
                        sx={{width:'100%'}}
                    />
                </div>
                <br/>
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
                        sx={{width:'100%'}}
                    />
                </div>
                <br/>
                <Button type='submit' variant="contained">Login</Button>
                <br/>
                <br/>
                {/* <span>Does't have an account ?
                    <Link to="/signup">Signup</Link>
                </span> */}
            </form>
            <ToastContainer />
        </Card>
    )
}

export default Login