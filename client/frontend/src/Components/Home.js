import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';


function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    return (
        <div className="container">
            <header>
                <h1>Vehicle Insurance Co.</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <div className="claim-section">
                <h2>File an Insurance Claim</h2>
                <Link to="/insurance-claim">
                    <button>Go to Insurance Claim</button>
                </Link>
            </div>

            <div className="payment-section">
                <h2>Pay Insurance</h2>
                <Link to="/pay-insurance">
                    <button>Go to Pay Insurance</button>
                </Link>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Home;
