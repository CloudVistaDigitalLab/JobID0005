import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import axios from 'axios';

function AdminHome() {
    const [claims, setClaims] = useState([]); // To store claims data
    const navigate = useNavigate();

    // Fetch claims on page load
    useEffect(() => {
        axios
            .get('http://localhost:4002/getClaims')
            .then((response) => setClaims(response.data)) // Ensure proper variable usage
            .catch((err) => console.log(err));
    }, []);

    // Handle logout functionality
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    // Format the claim amount in LKR currency format
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="claims-section">
            <h2>Client Submitted Claims</h2>
            <p>Total Claims: {claims.length}</p> {/* Display total claims count */}
            <button onClick={handleLogout}>Logout</button>

            <section>
                {claims && claims.length > 0 ? (
                    <div>
                        {claims.slice(0, 3).map((claim) => (
                            <div key={claim._id} className="claim-item">
                                <p><strong>Claim ID:</strong> {claim._id}</p>
                                <p><strong>Status:</strong> {claim.status || 'Pending'}</p>
                                <Link to={`/admin/view-claim/${claim._id}`}>
                                    <button>View Claim Details</button>
                                </Link>
                            </div>
                        ))}
                        <div className="view-all-button">
                            <Link to="/view-all-claims">
                                <button>View All Claims</button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <p>No claims remaining.</p>
                )}
            </section>

            <section className="admin-actions">
                <h2>Admin Actions</h2>
                <div>
                    <Link to="/admin/approve-reject">
                        <button>Approved/Rejected Claims</button>
                    </Link>
                </div>
            </section>

            <ToastContainer />
        </div>
    );
}

export default AdminHome;
