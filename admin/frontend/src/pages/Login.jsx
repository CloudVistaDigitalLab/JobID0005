import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'


function Login() {

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
            return handleError('email and password are required')
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
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/adminHome')
                }, 1000)
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
    }

    return (
        <Card className='container'>
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
                <span>Does't have an account ?
                    <Link to="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </Card>
    )
}

export default Login