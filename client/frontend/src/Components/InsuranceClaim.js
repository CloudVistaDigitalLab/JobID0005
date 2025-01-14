import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../index.css';
import axios from 'axios';
import app from '../firebaseConfig';
import { jwtDecode } from 'jwt-decode';
import { QRCodeSVG } from 'qrcode.react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, CircularProgress, Modal, Typography, Container, Grid, Card, CardMedia, Box, } from '@mui/material';

function InsuranceClaim() {

  const [claim, setClaim] = useState(null);
  const [nextClaimId, setNextClaimId] = useState(null);
  const navigate = useNavigate();
  const [claimDetails, setClaimDetails] = useState({
    claimId: '',
    fullName: '',
    contactNumber: '',
    policyNumber: '',
    incidentDate: '',
    claimAmount: '',
    description: '',

  });
  const [evidenceFiles, setEvidenceFiles] = useState([]); // Updated state for multiple files
  const [uploadedURLs, setUploadedURLs] = useState([]); // URLs for uploaded files
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isVerify, setIsVerify] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if state is passed and set the modal visibility
    if (location.state && location.state.isVerify) {
      setIsVerify(true);
    }
  }, [location]);




  useEffect(() => {
    // Fetching the latest claim and the next claimId
    const fetchClaim = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/claim/getclaim');
        if (response.data.success) {
          setClaim(response.data.existingDetails);
          setNextClaimId(response.data.nextClaimId); // Set the next claim ID
        } else {
          setError('Failed to load claims');
        }
      } catch (err) {
        setError('Error fetching claims');
        console.error(err);
      }
    };

    fetchClaim();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!claim) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClaimDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleVerifyClaim = () => {
    setIsVerify(true); // Open modal when button is clicked
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError('You can only upload up to 5 images.');
      return;
    }

    setError(null);
    setIsSubmitting(true); // Disable submit button and show loading indicator
    const urls = [];

    try {
      const storage = getStorage(app);

      for (const file of files) {
        const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        urls.push(downloadURL);
        console.log('File uploaded successfully:', downloadURL);
      }

      setUploadedURLs(urls); // Update URLs in state
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload evidence. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable submit button after upload
    }
  };






  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, user is not authenticated');
      return;
    }

    // Decode the token to extract the userId (_id)
    const decodedToken = jwtDecode(token);
    const userId = decodedToken._id;

    // Prepare form data
    const formData = new FormData();
    Object.keys(claimDetails).forEach((key) => {
      formData.append(key, claimDetails[key]);
    });

    // Append the userId to form data
    formData.append('userId', userId);

    // Send URLs as a JSON string
    formData.append('uploadedURLs', JSON.stringify(uploadedURLs));

    // Log FormData to verify the content
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:4000/api/claim', formData);
      if (response.status === 201) {
        setIsSubmitted(true);
        setClaimDetails({
          claimId: '',
          fullName: '',
          contactNumber: '',
          policyNumber: '',
          incidentDate: '',
          claimAmount: '',
          description: '',
        });
        setEvidenceFiles([]);
        setUploadedURLs([]);
      }
    } catch (err) {
      console.error('Error submitting claim:', err);
      setError('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = 'geeshanthisera1234@gmail.com'; // Recipient's email
  const subject = `Insurance Claim Verification: ${nextClaimId}`; // Subject including Claim ID
  const body = `This is a message sent from the QR Code for Claim ID: ${nextClaimId}. 
  Please verify the claim details to confirm if this is an actual accident.
  
  Police Officer Details:
  Name: 
  Contact: 
  National ID:
  Police Station: 
  `;

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;


  const closeConfirmation = () => setIsSubmitted(false);

  const closeVerifyConfirmation = () => setIsVerify(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    console.log('User Logged out');
    setTimeout(() => {
      navigate('/home');
    }, 1000);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 15, marginBottom: 15, padding: '5px', borderRadius: '12px', boxShadow: 3 }}>

      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px 20px" width="100%">
        <Typography variant="h4">Vehicle Insurance Co.</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/home')}
          sx={{ marginLeft: 'auto', width: '200px' }}
        >
          Back
        </Button>

      </Box>

      {/* Claim Form Section */}
      <Container maxWidth="md" sx={{ marginTop: 5, marginBottom: 5, padding: '30px', borderRadius: '12px', boxShadow: 3 }}>
        <Typography variant="h5">File an Insurance Claim</Typography>
        <Typography variant="h6" sx={{ marginTop: 2 }}>Your Claim ID : {nextClaimId}</Typography>

        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Full Name"
            name="fullName"
            value={claimDetails.fullName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Contact Number"
            name="contactNumber"
            type="tel"
            value={claimDetails.contactNumber}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Policy Number"
            name="policyNumber"
            value={claimDetails.policyNumber}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Date of Incident"
            name="incidentDate"
            type="date"
            value={claimDetails.incidentDate}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Claim Amount"
            name="claimAmount"
            type="number"
            value={claimDetails.claimAmount}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Description of the Incident"
            name="description"
            value={claimDetails.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
            margin="normal"
          />

          <input
            type="file"
            name="evidenceFiles"
            id="file-upload"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            style={{ display: 'none' }} // Hide the default input
          />

          <Container maxWidth="md" sx={{ marginTop: 5, marginBottom: 5, borderRadius: '5px', border: "#ccc solid 1px" }}>
            <label
              htmlFor="file-upload"
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                margin: '10px 0',
                textAlign: 'center',
              }}
            >
              Choose Evidence
            </label>
          </Container>

          {uploadedURLs.length > 0 && (
            <Grid container spacing={2}>
              {uploadedURLs.map((url, index) => (
                <Grid item xs={2.4} key={index}> {/* xs={2.4} ensures 5 items per row */}
                  <Card>
                    <CardMedia
                      component="img"
                      alt={`Evidence ${index}`}
                      height="150"
                      image={url}
                      title={`Evidence ${index}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Container sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Container>
              <div
                style={{
                  backgroundColor: 'white',
                  margin: '0px',
                  width: '300px',
                  // Define height for proper centering
                  display: 'flex', // Use flexbox to center content
                  justifyContent: 'center', // Center horizontally
                  alignItems: 'center', // Center vertically
                  textAlign: 'center',
                }}
              >
                {isSubmitting ? (
                  <p style={{ color: "#FE9900" }}>Please wait, loading images...</p> // Or use a spinner component here
                ) : (
                  <span></span>
                )}
              </div>
            </Container>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
              style={{ marginTop: '20px' }}
              sx={{ '&:hover': { backgroundColor: '#5B6B7C' } }}
            >
              {isSubmitting ? (
                <span>Loading images...</span>  // Or use a spinner component here
              ) : (
                'Submit Claim'
              )}
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleVerifyClaim} // Open the modal
              fullWidth
              style={{ marginTop: '20px' }}
              sx={{ '&:hover': { backgroundColor: '#5B6B7C' } }}
            >
              Verify Claim by Police
            </Button>


          </Container>
        </form>


        <Modal open={isVerify} onClose={closeVerifyConfirmation}>
          <div style={{ padding: '30px', backgroundColor: 'white', margin: '100px auto', width: '500px', textAlign: 'center', borderRadius: '10px' }}>
            <QRCodeSVG
              value={mailtoLink} // QR code will contain the mailto link
              size={256} // Size of the QR code (pixels)
              fgColor="#000000" // Foreground color (QR code color)
              bgColor="#ffffff" // Background color (QR code background)
              level="H" // Error correction level (L, M, Q, H)
              includeMargin={true} // Include margin around the QR code
            />
            <h4>Claim ID: {nextClaimId}</h4>
            <p>Please scan the QR code to verify the claim.</p>
            <Button variant="contained" color="primary" onClick={closeVerifyConfirmation}>Close</Button>
          </div>
        </Modal>



        <Modal open={isSubmitted} onClose={closeConfirmation} >
          <div style={{ padding: '30px', backgroundColor: 'white', margin: '100px auto', width: '500px', textAlign: 'center', borderRadius: '10px' }}>
            <Typography variant="h6">Claim submitted successfully! We will contact you soon...!</Typography>
            <Container
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: '#FFCBCB', // Add background color to the container
                padding: '5px',  // Optional: Add padding to the container for spacing
                borderRadius: '15px', // Optional: Add border radius to the container
              }}
            >
              <Typography variant="h6" sx={{ marginTop: 5, marginBottom: 5, color: 'red' }}>
                Your Claim ID : {nextClaimId}
              </Typography>
            </Container>
            <Button variant="contained" color="primary" onClick={closeConfirmation}>Close</Button>
          </div>
        </Modal>
      </Container>
    </Container>
  );
}

export default InsuranceClaim;
