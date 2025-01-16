import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';

export default function AdminRegistration() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError('name, email and password are required')
    }
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/signup`;
      console.log('Signup URL:', url); 
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login')
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
    <Box sx={{px:2, py:1}}>
      <Box>
        <Typography variant="h4" color="initial" sx={{fontWeight:700, pb:1}}>
          Admin Registration
        </Typography>
      </Box>
      <Divider/>
        <form onSubmit={handleSignup} style={{display:'flex', flexDirection:'column', gap:10, marginTop:20}}>
          <Box>
            <TextField
              onChange={handleChange}
              type='text'
              name='name'
              autoFocus
              label='Full Name'
              value={signupInfo.name}
              fullWidth
            />
          </Box>
            <Box>
              <TextField
                onChange={handleChange}
                type='email'
                name='email'
                label='Email'
                fullWidth
                value={signupInfo.email}
              />
            </Box>
            <Box>
              <TextField
                onChange={handleChange}
                type='password'
                name='password'
                label='Password'
                fullWidth
                value={signupInfo.password}
              />
            </Box>
            <Box sx={{display:'flex', justifyContent:'end'}}>
              <Button type='submit' variant="contained" fullWidth sx={{width:'15%'}}>Register</Button>
            </Box>
            
        </form>
            <ToastContainer />
        </Box>
  )
}
