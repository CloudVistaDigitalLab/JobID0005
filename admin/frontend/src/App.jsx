import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Button, CssBaseline } from '@mui/material';
import customTheme from './customTheme';

import './App.css';
import './index.css';
import Login from './pages/Login';
import Signup from './components/Signup';
import AdminHome from './components/AdminHome';
import WelcomePage from './components/WelcomePage'; 
import RefreshHandler from './RefreshHandler';
import ClaimList from './components/ClaimList';
import ViewAllClaims from './components/AdminViewAllClaims';
import BuyInsurancePlan from './components/BuyInsurancePlan';
import AppAppBar from './components/AppAppBar';


import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from '@toolpad/core/Account';

import { useNavigate, Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import Dashboard from './pages/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import Claims from './pages/Claims';
import AdminRegistration from './pages/AdminRegistration';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import GarageIcon from '@mui/icons-material/Garage';

import { handleError, handleSuccess } from './utils';
import ToggleColorMode from './features/toggle-mode/ToggleColorMode';
import Quotations from './pages/Quotations';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          localStorage.setItem('currentPath', '/dashboard')
          window.location.href = '/dashboard';
        }}
      >
        Dashboard
      </span>
    ),
    icon: (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          localStorage.setItem('currentPath', '/dashboard')
          window.location.href = '/dashboard';
        }}
      >
        <DashboardIcon />
      </span>
    ),
  },
  {
    segment: 'claims',
    title: (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          localStorage.setItem('currentPath', '/claims')
          window.location.href = '/claims';
        }}
      >
        Claims
      </span>
    ),
    icon: (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          localStorage.setItem('currentPath', '/claims')
          window.location.href = '/claims';
        }}
      >
        <DescriptionIcon />
      </span>
    ),
  },
  {
    segment: 'garage',
    title: (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          localStorage.setItem('currentPath', '/garage')
          window.location.href = '/garage-quotations'; 
        }}
      >
        Garage Quotations
      </span>
    ),
    icon: (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          localStorage.setItem('currentPath', '/garage')
          window.location.href = '/garage-quotations';
        }}
      >
        <GarageIcon />
      </span>
    ),
  },
  {
    kind: 'header',
    title: 'Registarions',
  },
  {
    segment: 'admin-reg',
    title: (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          localStorage.setItem('currentPath', '/admin-reg')
          window.location.href = '/admin-registration';
        }}
      >
        Admin Registration
      </span>
    ),
    icon: (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          localStorage.setItem('currentPath', '/admin-reg')
          window.location.href = '/admin-registration';
        }}
      >
        <AppRegistrationIcon />
      </span>
    ),
  },
];

const nav = (
  <React.Fragment>
    <ListItemButton href='/'>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton href='/test'>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Test" />
    </ListItemButton>
  </React.Fragment>
)

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  /**
   * The handler used when the preview is expanded
   */
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  /**
   * The state of the Account popover
   * @default false
   */
  open: PropTypes.bool,
};

const accounts = [
  {
    id: 1,
    name: 'Bharat Kashyap',
    email: 'bharatkashyap@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
    projects: [
      {
        id: 3,
        title: 'Project X',
      },
    ],
  },
  {
    id: 2,
    name: 'Bharat MUI',
    email: 'bharat@mui.com',
    color: '#8B4513', // Brown color
    projects: [{ id: 4, title: 'Project A' }],
  },
];

function SidebarFooterAccountPopover() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Accounts
      </Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              columnGap: 2,
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.95rem',
                  bgcolor: account.color,
                }}
                src={account.image ?? ''}
                alt={account.name ?? ''}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
              primary={account.name}
              secondary={account.email}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton onClick={handleLogout}>
          <Typography>Log Out</Typography>
        </SignOutButton>
      </AccountPopoverFooter>
    </Stack>
  );
}

const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

function SidebarFooterAccount({ mini }) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);
  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: 'left', vertical: 'bottom' },
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.32)'})`,
                mt: 1,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired,
};

const demoSession = {
  user: {
    name: 'Bharat Kashyap',
    email: 'bharatkashyap@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
  },
};

function App(props) {
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = React.useState('light')
  const currentTheme = createTheme(customTheme(themeMode),);

  const userName = localStorage.getItem('loggedInUser');
  const userEmail = localStorage.getItem('loggedInUserEmail');

  const currentSession = {
    user: {
      name: userName,
      email: userEmail,
    },
  };

  useEffect(() => {
    const themeFromLocalStorage = localStorage.getItem('theme');
    if (themeFromLocalStorage) {
      setThemeMode(themeFromLocalStorage);
    } else {
      setThemeMode('light');
    }
  }, []);
  
  const theme = useTheme();
  const toggleTheme = () => {
    if (themeMode === 'light') {
      setThemeMode('dark')
      localStorage.setItem('theme', 'dark');
    } else {
      setThemeMode('light')
      localStorage.setItem('theme', 'light');
    }
    
  }

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';
  
  const [is404, setIs404] = React.useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = React.useState(false);
  const [isFooterHiddden, setIsFooterHidden] = React.useState(false);
  const currentLocation = window.location.pathname;

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };


  
  const [pathname, setPathname] = React.useState('');

  useEffect(() => {
    const currentPath = localStorage.getItem("currentPath");
    setPathname(currentPath)
  })

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const [session, setSession] = React.useState(demoSession);
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(currentSession);
      },
      signOut: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
      },
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  function toggleThemeFunc() {
    return(
      <ToggleColorMode mode={themeMode} toggleColorMode={toggleTheme}/>
    )
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <RefreshHandler setIsAuthenticated={setIsAuthenticated}>
        {isAuthPage ?
          <main>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          :
          <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={currentTheme}
            authentication={authentication}
            session={currentSession}
            branding={{title: 'Vehicle Insurance Co.', logo: ''}}
          >
            <DashboardLayout
              slots={{
                toolbarActions: toggleThemeFunc
              }}
            >
              <main>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/adminHome" element={<PrivateRoute element={<AdminHome />} />} />
                  <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                  <Route path="/claims" element={<PrivateRoute element={<Claims />} />} />
                  <Route path="/admin-registration" element={<PrivateRoute element={<AdminRegistration />} />} />
                  <Route path="/garage-quotations" element={<PrivateRoute element={<Quotations />} />} />
                  <Route path="/welcome" element={<WelcomePage />} /> 
                  <Route path="/admin/claim-list" element={<PrivateRoute element={<ClaimList />} />} />
                  <Route path="/view-all-claims" element={<PrivateRoute element={<ViewAllClaims />} />} />
                </Routes>
              </main>
            </DashboardLayout>
          </AppProvider>
        }
      </RefreshHandler>
    </ThemeProvider>
  );
}

export default App;
