import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../index.css';
import axios from 'axios';

function InsuranceClaim() {
  const navigate = useNavigate(); 
  const [claimDetails, setClaimDetails] = useState({
    fullName: '',
    contactNumber: '',
    policyNumber: '',
    incidentDate: '',
    claimAmount: '',
    description: '',
  });
  const [evidenceFiles, setEvidenceFiles] = useState([]); // Updated state for multiple files
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClaimDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setEvidenceFiles(Array.from(e.target.files)); // Store multiple files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    if (!claimDetails.contactNumber.match(/^\d{10}$/)) {
      setError('Contact number must be 10 digits.');
      return;
    }
    if (parseFloat(claimDetails.claimAmount) <= 0) {
      setError('Claim amount must be greater than 0.');
      return;
    }
    if (!claimDetails.policyNumber.match(/^\d{6}-\d{4}$/)) {
      setError('Policy number must be in the format: 123456-1234');
      return;
    }

    const formData = new FormData();
    Object.keys(claimDetails).forEach((key) => {
      formData.append(key, claimDetails[key]);
    });

    // Append multiple files to FormData
    evidenceFiles.forEach((file) => {
      formData.append('evidenceFiles', file);
    });

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:4000/api/claim', formData);
      if (response.status === 200) {
        setIsSubmitted(true);
        setClaimDetails({
          fullName: '',
          contactNumber: '',
          policyNumber: '',
          incidentDate: '',
          claimAmount: '',
          description: '',
        });
        setEvidenceFiles([]);
      }
    } catch (err) {
      setError('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeConfirmation = () => setIsSubmitted(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    console.log('User Logged out'); 
    setTimeout(() => {
      navigate('/home'); 
    }, 1000);
  };

  return (
    <div className="container">
      <header>
         <h1>Vehicle Insurance Co.</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="claim-section">
        <h3>File an Insurance Claim</h3>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="claim-form" encType="multipart/form-data">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Your Full Name"
            value={claimDetails.fullName}
            onChange={handleChange}
            required
          />

          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            placeholder="Your Contact Number"
            value={claimDetails.contactNumber}
            onChange={handleChange}
            required
          />

          <label>Policy Number (Format: 123456-1234)</label>
          <input
            type="text"
            name="policyNumber"
            placeholder="Enter Policy Number"
            value={claimDetails.policyNumber}
            onChange={handleChange}
            required
          />

          <label>Date of Incident</label>
          <input
            type="date"
            name="incidentDate"
            value={claimDetails.incidentDate}
            onChange={handleChange}
            required
          />

          <label>Claim Amount</label>
          <input
            type="number"
            name="claimAmount"
            placeholder="Enter Claim Amount"
            value={claimDetails.claimAmount}
            onChange={handleChange}
            required
          />

          <label>Description of the Incident</label>
          <textarea
            name="description"
            placeholder="Provide details of the incident"
            value={claimDetails.description}
            onChange={handleChange}
            required
          />

          <label>Upload Evidence </label>
          <input
            type="file"
            name="evidenceFiles"
            onChange={handleFileChange}
            multiple // Allow multiple file uploads
          />

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>

        {isSubmitted && (
          <div className="modal">
            <div className="modal-content">
              <p>Claim submitted successfully! We will contact you soon.</p>
              <button onClick={closeConfirmation}>Close</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default InsuranceClaim;