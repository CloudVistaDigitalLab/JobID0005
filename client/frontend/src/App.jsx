import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Button, CssBaseline } from '@mui/material';
import customTheme from './customTheme';
// import AppAppBar from './components/appbar/AppAppBar';
// import Footer from './components/footer/Footer';

import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import WelcomePage from './Components/WelcomePage';
import WelcomePageA from './Components/WelcomePage';
import RefrshHandler from './RefrshHandler';
import InsuranceClaim from './Components/InsuranceClaim';
import PayInsurance from './Components/PayInsurance';
import CompanyDetailsPage from './Components/CompanyDetailsPage';
import PaymentSuccess from './Components/PaymentSuccess';
import PaymentFailure from './Components/PaymentFailure';
import Footer from './Components/Footer';
import AppAppBar from './Components/AppAppBar';
import PaymentPage from './Components/Payment';

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

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
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
            <Route path="/" element={<WelcomePage />} />
            <Route path="/welcome" element={<WelcomePageA />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
            <Route path="/pay-insurance" element={<PayInsurance />} />
            <Route path="/insurance-claim" element={<InsuranceClaim />} />
            <Route path="/company/:companyName" element={<CompanyDetailsPage />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentFailure />} />
            <Route path="/payment/:companyName" element={<PaymentPage />} />
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
