import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Snackbar from '@mui/material/Snackbar';

import { handleError, handleSuccess } from '../utils';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Row(props) {
  const { row, type } = props;
  const [open, setOpen] = React.useState(false);
  const [openRejected, setOpenRejected] = React.useState(false);
  const [openAccepted, setOpenAccepted] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [imageURL, setImageURL] = React.useState(false);

  const handleClickOpenRejected = () => {
    setOpenRejected(true);
  };

  const handleCloseRejected = () => {
    setOpenRejected(false);
  };
  
  const handleClickOpenAccepted = () => {
    setOpenAccepted(true);
  };

  const handleCloseAccepted = () => {
    setOpenAccepted(false);
  };
  
  const handleClickOpenImage = (image) => {
    setImageURL(image);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState('');

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  
  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message={snackMsg}
        action={action}
        
      />
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.claimId}
        </TableCell>
        <TableCell >{row.fullName}</TableCell>
        <TableCell align="center">{row.policyNumber}</TableCell>
        <TableCell align="center">{row.incidentDate.split('T')[0]}</TableCell>
        {type === 'pending' &&
          <TableCell sx={{display:'flex', gap:1}}>
            <Button color="success" variant="contained" onClick={handleClickOpenAccepted}>Accept</Button>
            <Button color="error" variant="contained" onClick={handleClickOpenRejected}>Reject</Button>
          </TableCell>
        }
        {type === 'accepted' &&
          <TableCell sx={{display:'flex', gap:1}}>
            <Button color="success" variant="contained" disabled onClick={handleClickOpenAccepted}>Accepted</Button>
          </TableCell>
        }
        {type === 'rejected' &&
          <TableCell sx={{display:'flex', gap:1}}>
            <Button color="error" variant="contained" disabled onClick={handleClickOpenRejected}>Rejected</Button>
          </TableCell>
        }
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                More Details of {row.claimId}
              </Typography>
              <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Contact Number</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Requested Amount</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Description</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Claim Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow>
                          <TableCell>{row.contactNumber}</TableCell>
                          <TableCell>{row.claimAmount} LKR</TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.status}</TableCell>
                      </TableRow>
                  </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom component="div">
                Images Uploaded by {row.fullName}
              </Typography>
              {row.uploadedURLs && row.uploadedURLs.length > 0? ( 
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <TableRow>
                    {row.uploadedURLs.map((image, index) => (
                        <TableCell component="th" scope="row">
                          <img
                            onClick={()=>handleClickOpenImage(image)}
                            src={image}
                            alt={`Uploaded ${index}`}
                            style={{
                              height: "150px",
                              width: "100%",
                              objectFit: "cover",
                              borderRadius: "4px",
                              cursor: 'pointer',
                            }}
                          />
                        </TableCell>
                    ))}
                    </TableRow>
                  </TableBody>
                </Table>
              ) : ( 
                <Typography>Images Not Found</Typography>
              )}
                
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Dialog
        open={openRejected}
        onClose={handleCloseRejected}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const adminDescription = formJson.adminDescription;
            /*axios.patch(`http://localhost:4002/claims/reject-claim`, {
              _id: row._id,
              status: 'Rejected',
              adminDescription,
            })
            handleCloseRejected();*/
            try {
              const userId = row.userId; 
              const userResponse = await axios.get(`http://localhost:4002/user/get-by-id/${userId}`);
          
              if (userResponse.status === 200 && userResponse.data) {
                const userEmail = userResponse.data.email;
          
                const emailResponse = await axios.post(`http://localhost:4002/claims/send-email`, {
                  email: userEmail,
                  message: `The claim with ID ${row.claimId} has been Rejected. The reason is "${adminDescription}"`,
                  subject: "Claim Rejection Notification",
                });
          
                if (emailResponse.status === 200) {
                  console.log("Email sent successfully:", emailResponse.data);
                } else {
                  console.error("Failed to send email:", emailResponse.data);
                }
              } else {
                console.error("Failed to fetch user details:", userResponse.data);
              }
          
              await axios.patch(`http://localhost:4002/claims/reject-claim`, {
                _id: row._id,
              status: 'Rejected',
              adminDescription,
              });
          
              console.log("Claim status updated successfully");
              handleCloseAccepted();
             
              setSnackMsg("Claim rejected successfully!");
              handleClickSnack();
              setTimeout(()=>{
                window.location.reload();
              }, 3000)
              
            } catch (error) {
              console.error("Error in the onSubmit process:", error.response?.data || error.message);
              setSnackMsg("Failed to reject claim!");
              handleClickSnack();
            }
          },
        }}
      >
        <DialogTitle>Cliam Rejection Confiramtion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to reject the claim {row.userId}?
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="adminDescription"
            name="adminDescription"
            label="Reason for Rejection"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejected}>No</Button>
          <Button type="submit">Yes, Reject Claim</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAccepted}
        onClose={handleCloseAccepted}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const acceptedAmount = formJson.acceptedAmount;
            /*axios.patch(`http://localhost:4002/claims/accept-claim`, {
              _id: row._id,
              status: 'Accepted',
              acceptedAmount,
            })
            handleCloseAccepted();*/
            try {
              const userId = row.userId; 
              const userResponse = await axios.get(`http://localhost:4002/user/get-by-id/${userId}`);
          
              if (userResponse.status === 200 && userResponse.data) {
                const userEmail = userResponse.data.email;
          
                const emailResponse = await axios.post(`http://localhost:4002/claims/send-email`, {
                  email: userEmail,
                  message: `The claim with ID ${row.claimId} has been accepted for the amount of ${acceptedAmount}.`,
                  subject: "Claim Acceptance Notification",
                });
          
                if (emailResponse.status === 200) {
                  console.log("Email sent successfully:", emailResponse.data);
                } else {
                  console.error("Failed to send email:", emailResponse.data);
                }
              } else {
                console.error("Failed to fetch user details:", userResponse.data);
              }
          
              await axios.patch(`http://localhost:4002/claims/accept-claim`, {
                _id: row._id,
                status: 'Accepted',
                acceptedAmount,
              });
          
              console.log("Claim status updated successfully");
              handleCloseAccepted();

              setSnackMsg("Claim accepted successfully!");
              handleClickSnack();
              setTimeout(()=>{
                window.location.reload();
              }, 3000)
            } catch (error) {
              console.error("Error in the onSubmit process:", error.response?.data || error.message);
              setSnackMsg("Failed to accept claim!");
              handleClickSnack();
            }
          },
        }}
      >
        <DialogTitle>Cliam Acception Confiramtion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to accept the claim {row.claimId}?
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="acceptedAmount"
            name="acceptedAmount"
            label="Accepted Amount"
            type="number"
            fullWidth
            variant="standard"
            
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAccepted}>No</Button>
          <Button type="submit">Yes, Accept Claim</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openImage}
        onClose={handleCloseImage}
        sx={{width: '100%', height: '100%'}}
        fullScreen
      >
        <DialogTitle sx={{display:'flex', justifyContent:'space-between', alignItem:'center'}}>
          A Image for {row.claimId}
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseImage}
            aria-label="close"
            sx={{width: '30px', height: '30px'}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
        <img
          src={imageURL}
          alt={`Uploaded by ${row.fullname}`}
          style={{
            width: "100%",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default function Claims() {
  const [claims, setClaims] = useState([])

  const [pendingClaims, setPendingClaims] = useState([])
  const [pendingClaimsSearch, setPendingClaimsSearch] = useState('')
  const filteredPendingClaims = pendingClaims.filter((item) =>
    Object.values(item).some((value)=>
      value.toString().toLowerCase().includes(pendingClaimsSearch.toLowerCase())
    )
  )

  const [acceptedClaims, setAcceptedClaims] = useState([])
  const [acceptedClaimsSearch, setAcceptedClaimsSearch] = useState('')
  const filteredAcceptedClaims = acceptedClaims.filter((item) =>
    Object.values(item).some((value)=>
      value.toString().toLowerCase().includes(acceptedClaimsSearch.toLowerCase())
    )
  )

  const [rejectedClaims, setRejectedClaims] = useState([])
  const [rejectedClaimsSearch, setRejectedClaimsSearch] = useState('')
  const filteredRejectedClaims = rejectedClaims.filter((item) =>
    Object.values(item).some((value)=>
      value.toString().toLowerCase().includes(rejectedClaimsSearch.toLowerCase())
    )
  )
  useEffect(() => {
    axios
      .get('http://localhost:4002/getClaims')
      .then((response) => {
        const data = response.data;
        setClaims(data);
  
        // Filter claims by status
        setPendingClaims(data.filter((claim) => claim.status === 'Pending'));
        setAcceptedClaims(data.filter((claim) => claim.status === 'Accepted'));
        setRejectedClaims(data.filter((claim) => claim.status === 'Rejected'));
      })
      .catch((err) => console.log(err));
  }, []);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  

  return (
    <Box sx={{px:2, py:1}}>
      <Box>
        <Typography variant="h4" color="initial" sx={{fontWeight:700, pb:1}}>
          Claims
        </Typography>
      </Box>
      <Divider/>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} >
            <Tab 
              label="Pending Claims"  
              sx={{
                fontWeight: 700, 
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgb(42, 157, 143, 0.8)',
                },
              }}
            />
            <Tab 
              label="Accepted Claims"  
              sx={{
                fontWeight: 700, 
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgb(42, 157, 143, 0.8)',
                },
              }}
            />
            <Tab 
              label="Rejected Claims"  
              sx={{
                fontWeight: 700, 
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgb(42, 157, 143, 0.8)',
                },
              }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box>
            <Box sx={{display:'flex', alignItem:'center', justifyContent:"space-between", pb:1}}>
              <h2 color="initial" style={{fontWeight:700}}>
                Pending Claims
              </h2>
              <TextField 
                id="searchPending" 
                label="Search" 
                variant="outlined" 
                type="text"
                value={pendingClaimsSearch}
                onChange={(e)=>setPendingClaimsSearch(e.target.value)}
              />
            </Box>
            {pendingClaims && pendingClaims.length > 0?(
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}/>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Claim ID</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Vehicle Owner</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Policy Number</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Incident Date</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Options</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPendingClaims.map((claim)=>(
                      <Row key={claim.claimId} row={claim} type="pending"/>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ):(
              <Typography>No Pending Claims</Typography>
            )}
            
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
        <Box>
            <Box sx={{display:'flex', alignItem:'center', justifyContent:"space-between", pb:1}}>
              <h2 color="initial" style={{fontWeight:700}}>
                Accepted Claims
              </h2>
              <TextField 
                id="searchAccepted" 
                label="Search" 
                variant="outlined" 
                type="text"
                value={acceptedClaimsSearch}
                onChange={(e)=>setAcceptedClaimsSearch(e.target.value)}
              />
            </Box>
            {acceptedClaims && acceptedClaims.length > 0?(
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}/>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Claim ID</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Vehicle Owner</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Policy Number</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Incident Date</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Options</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAcceptedClaims.map((claim)=>(
                      <Row key={claim.claimId} row={claim} type="accepted"/>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ):(
              <Typography>No Accepted Claims</Typography>
            )}
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
        <Box>
             <Box sx={{display:'flex', alignItem:'center', justifyContent:"space-between", pb:1}}>
              <h2 color="initial" style={{fontWeight:700}}>
                Accepted Claims
              </h2>
              <TextField 
                id="searchRejected" 
                label="Search" 
                variant="outlined" 
                type="text"
                value={rejectedClaimsSearch}
                onChange={(e)=>setRejectedClaimsSearch(e.target.value)}
              />
            </Box>
            {rejectedClaims && rejectedClaims.length > 0?(
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}/>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Claim ID</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Vehicle Owner</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Policy Number</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Incident Date</TableCell>
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Options</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRejectedClaims.map((claim)=>(
                      <Row key={claim.claimId} row={claim} type="rejected"/>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ):(
              <Typography>No Rejected Claims</Typography>
            )}
          </Box>
        </CustomTabPanel>
      </Box>
      
    </Box>
  )
}
