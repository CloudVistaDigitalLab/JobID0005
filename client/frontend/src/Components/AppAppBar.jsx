import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleColorMode from './toggle-mode/ToggleColorMode';
import { alpha } from '@mui/material';

const logoStyle = {
  width: 'auto',
  height: '40px',
  cursor: 'pointer',
};

function AppAppBar({ mode, toggleColorMode }) {
  const [open, setOpen] = React.useState(false);
  const [loginInfo, setLoginInfo] = React.useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = React.useState(localStorage.getItem('token') ? true : false); // Check localStorage for login status

  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleError = (message) => {
    alert(message);
  };

  const handleSuccess = (message) => {
    alert(message);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };


  const handleNavigation = (path) => {
    navigate(path);
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
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setIsLoggedIn(true); // Set login state to true
        setTimeout(() => {
          navigate('/');
        }, 15000);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false); // Set login state to false
    navigate('/');
  };

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      navigate('/login'); // Navigate to login page if not logged in
    } else {
      handleLogout(); // Log out if already logged in
    }
  };


  const handleSignupClick = () => {
    if (!isLoggedIn) {
      navigate('/signup'); // Navigate to login page if not logged in
    } else {
      handleLogout(); // Log out if already logged in
    }
  };


  const handleAboutUsClick = () => {
    if (!isLoggedIn) {
      navigate('/about'); // Navigate to login page if not logged in
    } else {
      handleLogout(); // Log out if already logged in
    }
  };

  const handleContactClick = () => {
    if (!isLoggedIn) {
      navigate('/contactus'); // Navigate to login page if not logged in
    } else {
      handleLogout(); // Log out if already logged in
    }
  };

  const handleServiceClick = () => {
    if (!isLoggedIn) {
      navigate('/service'); // Navigate to login page if not logged in
    } else {
      handleLogout(); // Log out if already logged in
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              py: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px ${alpha('#2a9d8f', 0.1)}, 1px 1.5px 2px -1px ${alpha('#2a9d8f', 0.15)}, 4px 4px 12px -2.5px ${alpha('#2a9d8f', 0.15)}`
                  : `0 0 1px ${alpha('#2a9d8f', 0.7)}, 1px 1.5px 2px -1px ${alpha('#2a9d8f', 0.65)}, 4px 4px 12px -2.5px ${alpha('#2a9d8f', 0.65)}`,
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                px: 0,
                gap: 1,
                color: '#2a9d8f',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Vehicle Insurance Co.
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem onClick={() => scrollToSection('features')} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary" onClick={() => handleNavigation('/welcome')}>
                    Home
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleAboutUsClick} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary">
                    About Us
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleServiceClick} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary">
                    Services
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleContactClick} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary">
                    Contact Us
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('faq')} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary" onClick={() => handleNavigation('/home')}>
                    User Profile
                  </Typography>
                </MenuItem>
              </Box>
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLoginClick} // Handle login/logout on button click
                  sx={{ minWidth: '120px', p: '4px' }}
                >
                  {isLoggedIn ? 'Log out' : 'Log in'} {/* Show 'Log out' if logged in, else 'Log in' */}
                </Button>
                <Button variant="contained" color="primary" onClick={handleSignupClick} sx={{ minWidth: '120px', p: '4px' }}>
                  Sign up
                </Button>
              </Box>
            </Box>
            {/* Rest of the component remains unchanged */}
          </Toolbar>
        </Box>
      </AppBar>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
