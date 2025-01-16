import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import customTheme from './customTheme';

import Login from './Components/Login';
import Signup from './Components/Signup';

import HomePage from './Components/Home';

import RefrshHandler from './RefrshHandler';

import Footer from './Components/Footer';
import AppAppBar from './Components/AppAppBar';
import AboutUsPage from './Components/AboutUs';
import ServicesPage from './Components/Services'
import ContactUsPage from './Components/ContactUs'
import WelcomePage from './Components/Welcome'
import HomeLoggedPage from './Components/HomeLogged'


const App = () => {
  const [themeMode, setThemeMode] = React.useState('light');
  const currentTheme = createTheme(customTheme(themeMode));

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
      setThemeMode('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setThemeMode('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        {!isAuthPage && (
          <header>
            <AppAppBar toggleColorMode={toggleTheme} mode={themeMode} />
          </header>
        )}

        {/* Main content area */}
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/service" element={<ServicesPage />} />
            <Route path="/contactus" element={<ContactUsPage />} />
            <Route path="/" element={<WelcomePage />} />
            <Route path="/welcome" element={<HomeLoggedPage />} />
            
          </Routes>
        </Box>

        {/* Footer */}
        {!isAuthPage && (
          <footer>
            <Footer />
          </footer>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;
