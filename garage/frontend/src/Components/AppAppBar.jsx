import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import ToggleColorMode from './toggle-mode/ToggleColorMode';
import { alpha } from '@mui/material';

function AppAppBar({ mode, toggleColorMode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(localStorage.getItem('token') ? true : false); // Check localStorage for login status
  const [userName, setUserName] = React.useState(''); // Default to empty string

  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
      // Retrieve the stored user name from localStorage
      const storedUserName = localStorage.getItem('loggedInUserName');
      setUserName(storedUserName || ''); // Use stored name or default to empty string
    }
  }, [isLoggedIn]);

  const handleNavigation = (path) => {
    if (isLoggedIn || path === '/login' || path === '/signup') {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUserName'); // Remove user name from localStorage
    setIsLoggedIn(false);
    setUserName(''); // Clear the user name on logout
    navigate('/');
    window.location.reload();
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
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, gap: 1, color: '#2a9d8f' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Vehicle Insurance Co.
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem sx={{ py: '6px', px: '12px', '&:hover': { backgroundColor: 'transparent' } }} onClick={(e) => e.preventDefault()}>
                  <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Welcome,&nbsp;
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#2a9d8f', textAlign: 'center' }}>
                    {userName}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/welcome')} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary">
                    Home
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/home')} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary">
                    Submit Quotation
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/about')} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary">
                    About Us
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/service')} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary">
                    Services
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/contactus')} sx={{ py: '6px', px: '12px' }}>
                  <Typography variant="body2" color="text.primary">
                    Contact Us
                  </Typography>
                </MenuItem>
              </Box>

              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 5, ml: 2 }}>
                {isLoggedIn ? (
                  <Button variant="contained" color="primary" onClick={handleLogout} sx={{ minWidth: '120px', p: '4px' }}>
                    Log out
                  </Button>
                ) : (
                  <>
                    <Button variant="contained" color="primary" onClick={handleLogin} sx={{ minWidth: '120px', p: '4px' }}>
                      Log in
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSignup} sx={{ minWidth: '120px', p: '4px' }}>
                      Sign up
                    </Button>
                  </>
                )}
              </Box>
            </Box>
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
