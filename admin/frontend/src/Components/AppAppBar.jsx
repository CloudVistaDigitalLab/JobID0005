import * as React from 'react';
import PropTypes from 'prop-types';

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

import { useNavigate } from 'react-router-dom';

const logoStyle = {
  width: 'auto',
  height: '40px',
  cursor: 'pointer',
};

function AppAppBar({ mode, toggleColorMode }) {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
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

  const handleNavigate = (navigateTo) => {
    navigate(`${navigateTo}`);
  }

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
        <Box sx={{width:'100%'}}>
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
              <Typography variant='h4' sx={{fontWeight:700}}>Vehicle Insurance Co.</Typography>
            </Box>
            
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem
                  onClick={() => scrollToSection('features')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Home
                  </Typography>
                </MenuItem>
                
                <MenuItem
                  onClick={() => scrollToSection('faq')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    About Us
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('faq')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Services
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('faq')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Contact Us
                  </Typography>
                </MenuItem>
              </Box>
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              <Box
                sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNavigate('/login')}
                  sx={{ minWidth: '120px', p: '4px' }}
                >
                  Log in
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => scrollToSection('contact')}
                  sx={{ minWidth: '120px', p: '4px' }}
                >
                  Sign up
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  </Box>
                  <MenuItem onClick={() => scrollToSection('features')}>
                    Home
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('testimonials')}>
                    Project Scope
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('highlights')}>
                    Milestones
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('pricing')}>
                    Downloads
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('faq')}>
                    About Us
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('faq')}>
                    Contact Us
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="contained"
                      component="a"
                      href="/material-ui/getting-started/templates/sign-up/"
                      target="_blank"
                      sx={{ width: '100%' }}
                    >
                      Sign up
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      component="a"
                      href="/material-ui/getting-started/templates/sign-in/"
                      target="_blank"
                      sx={{ width: '100%' }}
                    >
                      Sign in
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
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
