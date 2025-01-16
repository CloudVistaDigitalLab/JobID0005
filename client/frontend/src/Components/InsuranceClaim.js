import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../index.css';
import axios from 'axios';
import app from '../firebaseConfig';
import { jwtDecode } from 'jwt-decode';
import { QRCodeSVG } from 'qrcode.react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Divider, Dialog, DialogActions, DialogContent, DialogTitle, Link, TextField, Button, CircularProgress, Modal, Typography, Container, Grid, Card, CardMedia, Box, MenuItem, Tooltip } from '@mui/material';

function InsuranceClaim() {

  const [claim, setClaim] = useState(null);
  const [nextClaimId, setNextClaimId] = useState(null);
  const navigate = useNavigate();
  const [claimPolicyDetails, setClaimPolicyDetails] = useState({ policyNumber: '' });
  const [openDialog, setOpenDialog] = useState(false);




  const handlePolicyChange = (e) => {
    setClaimDetails({ ...claimDetails, [e.target.name]: e.target.value });
  };


  // Function to open the dialog


  const handleDialogOpen = async () => {
    setOpenDialog(true);
    console.log('LocalStorage:', localStorage);

    const userId = localStorage.getItem('loggedInUserId');


    console.log('User ID:', userId);

    if (userId) {
      try {
        const response = await axios.get(`http://localhost:4000/api/payments/non-expired/${userId}`);
        setClaimPolicyDetails(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      handleError('User ID not found');
    }
  };

  const handleError = (message) => {
    console.error(message); // Handle error appropriately, maybe show an alert or toast
  };

  // Function to close the dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

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
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);


  const garages = [
    { name: 'Matara Garage (Pvt) Ltd', district: 'Colombo', location: 'No:287/5 High Level Road Kirulapone Colombo 05', contact: '0112818888, 0112818040, 0112818041' },
    { name: 'Pawana Motors', district: 'Colombo', location: 'No 410 Akuregoda Talangama South Battaramulla', contact: '0718670694' },
    { name: 'Neotech Motors and Service', district: 'Colombo', location: 'No:23/1/A Main Street Battaramulla', contact: '0112887998' },
    { name: 'Mayura & Sons Auto Repairs (Pvt) Ltd', district: 'Colombo', location: 'No 483/4 Awissawella Road Kaduwela', contact: '0112537571, 0112539065' },
    { name: 'Upali Garage (Pvt) Ltd', district: 'Colombo', location: 'No:117A Negombo Road Kandana', contact: '0112236303, 0112229115' },
    { name: 'J R S Holdings (Pvt) Ltd', district: 'Colombo', location: 'No:984 Thalangama South Battaramulla', contact: '0112408282, 0777633563' },
    { name: 'Popular House', district: 'Colombo', location: 'No 75 Old Kesbewa Road Gangodawila Nugegoda', contact: '0112816905, 0112768084' },
    { name: 'Fixrich Auto (Pvt) Ltd', district: 'Colombo', location: 'No:95/20 Old Kesbewa Road Divulapitiya Boaralesgamuwa', contact: '0117112287, 0713917511' },
    { name: 'L R Motors (Pvt) Ltd', district: 'Colombo', location: 'No:56A Buthgamuwa Road Welikada Rajagiriya', contact: '0112884255' },
    { name: 'Indika Automobiles (Pvt) Ltd', district: 'Colombo', location: '91 Buthgamuwa Rd Welikada Rajagiriya', contact: '0114345426' },
    { name: 'Sampath Auto Engineers', district: 'Colombo', location: 'No 19/1 Liyanegoda Pannipitiya', contact: '0773569149' },
    { name: 'Wasantha Auto Electricals', district: 'Colombo', location: 'No 488/B2 Bodiraja Road Welipara Thalawathugoda', contact: '0776040253' },
    { name: 'Liyanage Motors', district: 'Colombo', location: 'No 164 /F Main St Battaramulla', contact: '0112888838, 0714295717' },
    { name: 'Ceylon Motor Works Services (Pvt) Ltd', district: 'Colombo', location: 'No 761/1 Kandy Road Kelaniya', contact: '0112917207' },
    { name: 'Glitz Park', district: 'Gampaha', location: 'Yakkala, Sri Lanka', contact: 'Not Available' },
    { name: 'Mymech', district: 'Colombo', location: 'Major districts like Colombo, Gampaha, Kandy, Kalutara', contact: 'Not Available' },
    { name: 'Dambulla Nishantha Jayasundera Ideal First Choice', district: 'Matale', location: '609 A, Kurunegala Road, Dambulla', contact: 'Not Available' },
    { name: 'Dambulla Nuwan Rangiri Motors & Windscreen', district: 'Matale', location: 'Kurunegala road, Dambulla', contact: 'Not Available' },

    // Additional 50 garages
    { name: 'Alpha Auto Services', district: 'Colombo', location: 'No:500 Galle Road Colombo 06', contact: '0112502565' },
    { name: 'City Car Repairs', district: 'Colombo', location: 'No:120A Malabe Road Nugegoda', contact: '0112255115' },
    { name: 'Siva Motors', district: 'Kandy', location: 'No:450 Kandy Road, Peradeniya', contact: '0812273321' },
    { name: 'Apex Auto Care', district: 'Galle', location: 'No:30 Galle Road Galle', contact: '0912234343' },
    { name: 'Speedy Repairs', district: 'Kalutara', location: 'No:21A Beach Road Beruwala', contact: '0342234334' },
    { name: 'Lanka Auto Experts', district: 'Ratnapura', location: 'No:10 Sri Dhamma Kiththi Road Ratnapura', contact: '0452234578' },
    { name: 'Ace Motors', district: 'Colombo', location: 'No:125A Old Kottawa Road, Nugegoda', contact: '0112342234' },
    { name: 'Revive Auto Service', district: 'Gampaha', location: 'No:15A Gampaha Road, Kelaniya', contact: '0112893145' },
    { name: 'Vega Auto Repairs', district: 'Matara', location: 'No:98 Colombo Road, Matara', contact: '0412234567' },
    { name: 'New Age Auto Mechanics', district: 'Negombo', location: 'No:75 Negombo Road, Katunayake', contact: '0312289191' },
    { name: 'Quick Fix Auto Garage', district: 'Anuradhapura', location: 'No:100 Kandy Road, Anuradhapura', contact: '0252278901' },
    { name: 'Premier Auto Works', district: 'Jaffna', location: 'No:7 Jaffna Main Road', contact: '0212233411' },
    { name: 'Dynamic Motors', district: 'Kurunegala', location: 'No:60 Kurunegala Road', contact: '0372231234' },
    { name: 'Auto Innovators', district: 'Colombo', location: 'No:134 Galle Road Colombo 04', contact: '0112437878' },
    { name: 'Max Motors', district: 'Gampaha', location: 'No:29A Colombo Road, Gampaha', contact: '0332234654' },
    { name: 'Elite Garage', district: 'Puttalam', location: 'No:8 Market Road Puttalam', contact: '0322237865' },
    { name: 'Swift Auto Services', district: 'Matale', location: 'No:112 Kurunegala Road, Matale', contact: '0662277999' },
    { name: 'Star Motors', district: 'Vavuniya', location: 'No:55 Vavuniya Road', contact: '0242222333' },
    { name: 'Pro Auto', district: 'Colombo', location: 'No:89 Kandy Road, Colombo 10', contact: '0112503987' },
    { name: 'Sri Lanka Auto Service', district: 'Kandy', location: 'No:88 Kandy Road, Kandy', contact: '0812278369' },
    { name: 'Velocity Auto Repairs', district: 'Ratnapura', location: 'No:122 Main Street Ratnapura', contact: '0452256432' },
    { name: 'Spark Auto Repairs', district: 'Anuradhapura', location: 'No:56 Anuradhapura Road', contact: '0252291009' },
    { name: 'Maverick Motors', district: 'Colombo', location: 'No:300 High Level Road, Colombo 04', contact: '0112733344' },
    { name: 'Metro Auto Services', district: 'Galle', location: 'No:234 Galle Road Galle', contact: '0912278999' },
    { name: 'Golden Motor Works', district: 'Kurunegala', location: 'No:24 Kandy Road, Kurunegala', contact: '0372289911' },
    { name: 'Lux Motors', district: 'Negombo', location: 'No:110 Negombo Road', contact: '0312223310' },
    { name: 'Champion Auto', district: 'Colombo', location: 'No:10 Nawala Road, Colombo 06', contact: '0112345667' },
    { name: 'Super Tech Auto Repairs', district: 'Gampaha', location: 'No:45 Gampaha Road, Gampaha', contact: '0332235678' },
    { name: 'Techno Auto Services', district: 'Matara', location: 'No:91 Matara Road, Matara', contact: '0412257896' },
    { name: 'Eco Auto', district: 'Colombo', location: 'No:78 Battaramulla Road, Colombo', contact: '0112367911' },
    { name: 'Auto Edge', district: 'Colombo', location: 'No:200 Kandy Road, Colombo 05', contact: '0112584365' },
    { name: 'Sapphire Auto', district: 'Jaffna', location: 'No:53 Jaffna Road', contact: '0212233445' },
    { name: 'Nova Auto Services', district: 'Puttalam', location: 'No:20 Negombo Road, Puttalam', contact: '0322234567' },
    { name: 'Top Gear Motors', district: 'Colombo', location: 'No:400 Galle Road, Colombo 06', contact: '0112753444' },
    { name: 'Turbo Auto Works', district: 'Gampaha', location: 'No:150 Gampaha Road, Gampaha', contact: '0332293000' },
    { name: 'Vibrant Motors', district: 'Kandy', location: 'No:25 Kandy Road, Kandy', contact: '0812225888' },
    { name: 'AutoCare Garage', district: 'Colombo', location: 'No:60 Nugegoda Road, Colombo 06', contact: '0112598222' },
    { name: 'Xtreme Auto', district: 'Ratnapura', location: 'No:33 Ratnapura Road, Ratnapura', contact: '0452278888' },
    { name: 'Roadmaster Motors', district: 'Jaffna', location: 'No:123 Jaffna Road', contact: '0212236765' },
    { name: 'Skyline Motors', district: 'Colombo', location: 'No:34 Colombo 07', contact: '0112776655' },
    { name: 'Future Auto Garage', district: 'Vavuniya', location: 'No:88 Vavuniya Road', contact: '0242233445' },
    { name: 'Prime Garage', district: 'Colombo', location: 'No:52 Kandy Road, Colombo 03', contact: '0112500000' },
    { name: 'Auto King', district: 'Galle', location: 'No:300 Galle Road', contact: '0912323444' }
  ];


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
          vehicleNumber: '',
          garageSelected: '',
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

          <Tooltip title="See your policy numbers">
            <Link href="#" onClick={handleDialogOpen}>
              policy numbers
            </Link>
          </Tooltip>



          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Policy Numbers & Vehicle Details</DialogTitle>
            <DialogContent>
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  {claimPolicyDetails && claimPolicyDetails.length > 0 ? (
                    <div>
                      {claimPolicyDetails.map((policy, index) => (
                        <Box key={index} sx={{ marginBottom: 2, boxShadow: 2, padding: 2, borderRadius: 2,  }}>
                          <Typography variant="h6" sx={{color:"#F01010" ,fontWeight:'bold'}}>Policy Number: {policy.policyId}</Typography>
                          
                         <Box>
                         <Typography sx={{alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>Vehicle Number: {policy.vehicleDetails.vehicleNumber}</Typography>
                         </Box>

                          
                        </Box>
                      ))}
                    </div>
                  ) : (
                    <p>No active policies found for this user.</p>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>


          <TextField
            label="Vehicle Number"
            name="vehicleNumber"
            value={claimDetails.vehicleNumber}
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
            select
            label="Select Garage"
            value={claimDetails.garageSelected}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            name="garageSelected"
            id="garageSelected"
          >
            <MenuItem value="">
              Select Garage
            </MenuItem>
            {garages.map((garage, index) => (
              <MenuItem key={index} value={garage.name}>
                {garage.name} - {garage.district} - {garage.location} - {garage.contact}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description of the Incident(*optional)"
            name="description"
            value={claimDetails.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}

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
