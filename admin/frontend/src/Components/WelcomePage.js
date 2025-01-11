import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Navigate to Login page
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigate to Signup page
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Admin Portal</h1>
        <p className="welcome-subtitle">Manage everything seamlessly in one place.</p>
        <div className="welcome-buttons">
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
          <button onClick={handleSignup} className="signup-button">
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
