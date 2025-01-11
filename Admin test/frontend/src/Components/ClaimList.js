import React, { useEffect, useState } from 'react';
import Evidence01 from '../Assets/Evidence01.jpeg';
import Evidence02 from '../Assets/Evidence02.jpeg';
import Evidence03 from '../Assets/Evidence03.jpeg';
import Evidence04 from '../Assets/Evidence04.jpg';
import Evidence05 from '../Assets/Evidence05.jpg';
import Evidence06 from '../Assets/Evidence06.jpeg';

function ClaimList() {
    const [claims, setClaims] = useState([]);

    useEffect(() => {
        // Mock claims data
        const mockClaims = [
            {
                id: '1',
                fullName: 'John Doe',
                contactNumber: '0712345678',
                policyNumber: '123456-7890',
                incidentDate: '2024-11-01',
                claimAmount: 50000,
                description: 'Accident occurred on the highway.',
                evidence: [Evidence01, Evidence02, Evidence03, Evidence04],
            },
            {
                id: '2',
                fullName: 'Jane Smith',
                contactNumber: '0776543210',
                policyNumber: '987654-3210',
                incidentDate: '2024-11-10',
                claimAmount: 75000,
                description: 'Car skidded during rain, hitting a pole.',
                evidence: [Evidence05, Evidence06],
            },
        ];
        setClaims(mockClaims);
    }, []);

    return (
        <div className="claimList-container">
            <header>
                <h1>Claim List</h1>
            </header>

            <section>
                {claims.length > 0 ? (
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Contact Number</th>
                                <th>Policy Number</th>
                                <th>Date of Incident</th>
                                <th>Claim Amount</th>
                                <th>Description</th>
                                <th>Evidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map((claim) => (
                                <tr key={claim.id}>
                                    <td>{claim.fullName}</td>
                                    <td>{claim.contactNumber}</td>
                                    <td>{claim.policyNumber}</td>
                                    <td>{claim.incidentDate}</td>
                                    <td>
                                        {new Intl.NumberFormat('en-LK', {
                                            style: 'currency',
                                            currency: 'LKR',
                                        }).format(claim.claimAmount)}
                                    </td>
                                    <td>{claim.description}</td>
                                    <td>
                                        <div className="evidence-container">
                                            {claim.evidence.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Evidence ${index + 1}`}
                                                    className="evidence-image"
                                                />
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No claims available.</p>
                )}
            </section>
        </div>
    );
}

export default ClaimList;