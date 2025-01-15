import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, Modal, Grid, CircularProgress, Container } from '@mui/material';

const RenewPayment = () => {
  const { id } = useParams(); // Get payment ID from URL
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [paymentInfo, setPaymentInfo] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    price: '',
  });


  const handleRenew = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    // Fetch the payment plan details by ID
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/payments/${id}`);
        setPaymentData(response.data);
        setPaymentInfo(response.data.paymentInfo); // Populate form with paymentInfo
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleConfirmRenew = async () => {

    setOpenModal(false);

    // Start the loading state
    setLoading(true);
    // Send updated payment details to backend
    try {
      await axios.put(`http://localhost:4000/api/payments/renew/${id}`, { paymentInfo });

      sendEmail(paymentData.paymentInfo?.emailAddress); 

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/home');
      }, 3500); // Redirect to a relevant page
    } catch (error) {
      console.error('Error renewing payment plan:', error);
    }
  };

  // Check if paymentData is null and prevent rendering until data is available
  if (!paymentData) {
    return <Typography>Loading...</Typography>;
  }


  const sendEmail = (email) => {
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    const emailData = {
        email: email,
        message: `Dear Customer,

We are excited to confirm that your subscription has been successfully renewed. Thank you for continuing to choose us!

Please find the details of your renewal below:

- Company: Vehicle Insurance Co.  
- From: Vehicle Insurance Co. (Finance Division)  
- Price:  ${paymentInfo.price}
- Renewal Date: ${formattedDate}

We appreciate your continued trust in us. If you have any questions or need further assistance, feel free to reach out to our customer service team.

Best regards,  
The Finance Team at Vehicle Insurance Co.

Note: This is an auto-generated message, and no reply is required.
`, // Renewal confirmation email message
    };

    fetch('http://localhost:4000/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Email sent successfully:', data);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
};


  return (

    <Box
      maxWidth="lg"
      sx={{
        position: 'relative',  // Use absolute positioning for centering
        top: '50%',            // Vertically center
        left: '17%',           // Horizontally center
        // Adjust position to truly center
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5,
        padding: '5px',
        borderRadius: 2,
        boxShadow: 2,
        height: 'auto',  // You can adjust the height based on the content's size
        width: '100%',  // Adjust width accordingly

      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 0, marginTop: 2, color: '#ccc' }}>
        Renew Payment Plan
      </Typography>
      <form>
        <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>Owner Information</Typography>
        <TextField
          label="Full Name"
          value={paymentData.clientInfo?.fullName || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          disabled
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Email"
          value={paymentData.clientInfo?.emailAddress || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          disabled
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Contact Number"
          value={paymentData.clientInfo?.contactNumber || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          disabled
          sx={{ marginBottom: 2 }}
        />

        <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>Vehicle Details</Typography>
        <TextField
          label="Registration Number"
          value={paymentData.vehicleDetails?.registrationNumber || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          disabled
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Model"
          value={paymentData.vehicleDetails?.model || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          disabled
          sx={{ marginBottom: 2 }}
        />

        <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>Payment Information</Typography>
        <TextField
          label="Card Holder Name"
          name="cardHolderName"
          value={paymentInfo.cardHolderName}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Card Number"
          name="cardNumber"
          value={paymentInfo.cardNumber}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Expiry Date"
          name="expiryDate"
          value={paymentInfo.expiryDate}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="CVV"
          name="cvv"
          value={paymentInfo.cvv}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Price"
          name="price"
          value={paymentInfo.price}
          InputProps={{ readOnly: true }}
          fullWidth
          sx={{ marginBottom: 2 }}
          disabled
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRenew}
            sx={{ marginTop: 2, marginBottom: 5, '&:hover': { backgroundColor: '#5B6B7C' } }}
          >
            Renew Plan
          </Button>
        </Box>

      </form>

      {/* Confirmation Modal */}
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 2,
            boxShadow: 24,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Are you sure you want to renew your payment plan?
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={handleModalClose}>
                No
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleConfirmRenew}>
                Yes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Loading Spinner */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 4,
            borderRadius: 2,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <CircularProgress size={50} sx={{ marginBottom: 2 }} />
          <Typography variant="h6">Processing Payment...</Typography>
        </Box>
      )}
    </Box>

  );
};

export default RenewPayment;
