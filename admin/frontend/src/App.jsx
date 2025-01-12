import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import './index.css';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminHome from './components/AdminHome';
import WelcomePage from './components/WelcomePage'; 
import RefrshHandler from './RefrshHandler';
import ClaimList from './components/ClaimList';
import ViewAllClaims from './components/AdminViewAllClaims';
import BuyInsurancePlan from './components/BuyInsurancePlan';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        {/* <Route path="/" element={<Navigate to="/welcome" />} /> Redirect to the Welcome Page */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/adminHome" element={<PrivateRoute element={<AdminHome />} />} />
        <Route path="/welcome" element={<WelcomePage />} /> 
        <Route path="/admin/claim-list" element={<PrivateRoute element={<ClaimList />} />} />
        <Route path="/view-all-claims" element={<PrivateRoute element={<ViewAllClaims />} />} />
        {/* <Route path="/buy-insurance-plan" element={<BuyInsurancePlan />} />  */}
      </Routes>
    </div>
  );
}

export default App;
