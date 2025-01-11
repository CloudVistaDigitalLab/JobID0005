import { Navigate, Route, Routes } from 'react-router-dom';
import './index.css'; 
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import WelcomePage from './Components/WelcomePage';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import InsuranceClaim from './Components/InsuranceClaim'; 
import PayInsurance from './Components/PayInsurance'; 
import CompanyDetailsPage from './Components/CompanyDetailsPage';
import PaymentSuccess from './Components/PaymentSuccess';
import PaymentFailure from './Components/PaymentFailure';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/pay-insurance" element={<PayInsurance />} />
        <Route path="/insurance-claim" element={<InsuranceClaim />} />
        <Route path="/company/:companyName" element={<CompanyDetailsPage />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentFailure />} />
      </Routes>
    </div>
  );
}

export default App;
