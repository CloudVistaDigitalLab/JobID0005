// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ClaimsTable = () => {
//   const [claims, setClaims] = useState([]);

//   useEffect(() => {
//     axios
//       .get('http://localhost:4002/getClaims')
//       .then((response) => setClaims(response.data))
//       .catch((err) => console.log(err));
//   }, []);

//   const updateStatus = (claimId, status) => {
//     axios
//       .patch('http://localhost:4002/updateClaimStatus', { claimId, status })
//       .then((response) => {
//         // Update the local state with the new status
//         setClaims((prevClaims) =>
//           prevClaims.map((claim) =>
//             claim._id === claimId ? { ...claim, status } : claim
//           )
//         );
//         alert(response.data.message);
//       })
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div className="claims-table-container">
//       <h1>Claims</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Full Name</th>
//             <th>Contact Number</th>
//             <th>Policy Number</th>
//             <th>Incident Date</th>
//             <th>Claim Amount</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {claims.map((claim) => (
//             <tr key={claim._id}>
//               <td>{claim.fullName}</td>
//               <td>{claim.contactNumber}</td>
//               <td>{claim.policyNumber}</td>
//               <td>{new Date(claim.incidentDate).toLocaleDateString()}</td>
//               <td>{claim.claimAmount}</td>
//               <td>{claim.status || 'Pending'}</td>
//               <td>
//                 <button
//                   onClick={() => updateStatus(claim._id, 'Approved')}
//                   style={{ color: 'green' }}
//                 >
//                   Approve
//                 </button>
//                 <button
//                   onClick={() => updateStatus(claim._id, 'Rejected')}
//                   style={{ color: 'red', marginLeft: '10px' }}
//                 >
//                   Reject
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ClaimsTable;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClaimsTable = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    // Fetch all pending claims
    axios
      .get('http://localhost:4002/getClaims') // API endpoint to get pending claims
      .then((response) => setClaims(response.data))
      .catch((err) => console.log(err));
  }, []);

  // Update the claim status to 'Approved' or 'Rejected' and remove it from the list
  const updateStatus = (claimId, status) => {
    axios
      .patch('http://localhost:4002/updateClaimStatus', { claimId, status }) // Update status in the backend
      .then((response) => {
        // Remove the claim from the pending claims list
        setClaims((prevClaims) =>
          prevClaims.filter((claim) => claim._id !== claimId)
        );
        alert(response.data.message); // Show a success message
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="claims-table-container">
      <h1>Pending Claims</h1>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Contact Number</th>
            <th>Policy Number</th>
            <th>Incident Date</th>
            <th>Claim Amount</th>
            <th>Status</th>
            <th>Actions</th>
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
              <td>{claim.status || 'Pending'}</td>
              <td>
                <button
                  onClick={() => updateStatus(claim._id, 'Approved')}
                  style={{ color: 'green' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(claim._id, 'Rejected')}
                  style={{ color: 'red', marginLeft: '10px' }}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimsTable;