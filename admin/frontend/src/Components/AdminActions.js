import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminActions = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    // Fetch approved claims
    axios
      .get('http://localhost:4002/getApprovedClaims') // API endpoint to get approved claims
      .then((response) => setClaims(response.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="admin-action-container">
      <h1>Approved Claims</h1>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Contact Number</th>
            <th>Policy Number</th>
            <th>Incident Date</th>
            <th>Claim Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim._id}>
              <td>{claim.fullName}</td>
              <td>{claim.contactNumber}</td>
              <td>{claim.policyNumber}</td>
              <td>{new Date(claim.incidentDate).toLocaleDateString()}</td>
              <td>{claim.claimAmount}</td>
              <td>{claim.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminActions;
