import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../firebaseConfig";

function ClaimForm() {
  const [imageURLs, setImageURLs] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    claimId: "",
    vehicleNumber: "",
    clientName: "",
    garageName: "",
    note: "",
    files: [], 
  });
  const [status, setStatus] = useState(""); 

  useEffect(() => {
    let timer;
    if (status) {
      
      timer = setTimeout(() => {
        setStatus("");
      }, 8000);
    }

    return () => clearTimeout(timer); 
  }, [status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleFileChange(e) {
    const files = e.target.files;
    if (files.length > 0) {
      try {
        setUploading(true);
        const uploadedImageURLs = [];

        for (let i = 0; i < files.length; i++) {
          const image = files[i];
          const storage = getStorage(app);
          const storageRef = ref(storage, `imagesQuatation/${Date.now()}-${image.name}`);
          await uploadBytes(storageRef, image);
          const downloadURL = await getDownloadURL(storageRef);
          uploadedImageURLs.push(downloadURL);
        }

        setImageURLs(uploadedImageURLs); 
        setFormData((prev) => ({ ...prev, files: [...files] })); 
      } catch (error) {
        console.error(error);
        setStatus("error"); 
      } finally {
        setUploading(false);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated");
      return;
    }

    
    const decodedToken = jwtDecode(token);
    const userId = decodedToken._id;

    const formDataToSubmit = {
      ...formData,
      userId,
      file: imageURLs, 
    };

    try {
      const response = await axios.post("http://localhost:4005/api/garage", formDataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Payment saved successfully:", response.data);
      setStatus("success"); 

      
      setFormData({
        claimId: "",
        vehicleNumber: "",
        clientName: "",
        garageName: "",
        note: "",
        files: [],
      });
      setImageURLs([]); 
    } catch (error) {
      console.error("Failed to save payment:", error.response?.data || error.message);
      setStatus("error"); 
    }
  };


  const garageOptions = [
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

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 700,
        margin: "auto",
        marginTop: 10,
        marginBottom: 5,
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 3,

      }}
    >
      <Typography variant="h4" sx={{ mb: 0, textAlign: "center" }}>
        Garage Quatation Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Claim ID"
          name="claimId"
          value={formData.claimId}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Vehicle Number"
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Client Name"
          name="clientName"
          value={formData.clientName}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Garage Name</InputLabel>
          <Select
            name="garageName"
            value={formData.garageName}
            onChange={handleInputChange}
          >
            {garageOptions.map((garage, index) => (
              <MenuItem key={index} value={garage.name}>
                {garage.name}-{garage.location}-{garage.district}-{garage.contact}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <input
          type="file"
          name="evidenceFiles"
          id="file-upload"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          style={{ display: "none" }} 
        />

        <Container maxWidth="md" sx={{ marginTop: 2, marginBottom: 1, borderRadius: "5px", border: "#ccc solid 1px" }}>
          <label
            htmlFor="file-upload"
            style={{
              display: "inline-block",
              padding: "8px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              margin: "10px 0",
              textAlign: "center",
            }}
          >
            Choose Quatation Receipt
          </label>
        </Container>

        <TextField
          fullWidth
          label="Note (Optional)"
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          margin="normal"
          multiline
          rows={3}
        />

        
        {imageURLs.length > 0 && (
          <div>
            {imageURLs.map((url, index) => (
              <img key={index} src={url} alt={`Uploaded ${index}`} style={{ maxWidth: 150, margin: "5px" }} />
            ))}
          </div>
        )}

        <Box sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          padding: '0px',
          borderRadius: '8px',
        }}>
         
          {status && (
            <Alert severity={status === "success" ? "success" : "error"} sx={{ marginBottom: 2 }}>
              {status === "success"
                ? "Your claim was submitted successfully!"
                : "There was an error submitting your claim."}
            </Alert>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={uploading}
        >
          {uploading ? "Uploading" : "Submit"}
        </Button>
      </form>
    </Paper>
  );
}

export default ClaimForm;
