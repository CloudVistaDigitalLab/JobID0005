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

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [openRejected, setOpenRejected] = React.useState(false);

  const handleClickOpenRejected = () => {
    setOpenRejected(true);
  };

  const handleCloseRejected = () => {
    setOpenRejected(false);
  };
  return (
    <React.Fragment>
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
        <TableCell sx={{display:'flex', gap:1}}>
          <Button color="success" variant="contained">Accept</Button>
          <Button color="error" variant="contained" onClick={handleClickOpenRejected}>Reject</Button>
        </TableCell>
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
                              src={image}
                              alt={`Uploaded ${index}`}
                              style={{
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
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
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleCloseRejected();
          },
        }}
      >
        <DialogTitle>Cliam Rejection Confiramtion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to reject this claim?
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Reason for Rejection"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejected}>No</Button>
          <Button type="submit">Yes, Reject Claim</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default function Claims() {
  const [claims, setClaims] = useState([])
  const [pendingClaims, setPendingClaims] = useState([])
  const [acceptedClaims, setAcceptedClaims] = useState([])
  const [rejectedClaims, setRejectedClaims] = useState([])
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
            <Box sx={{display:'flex', alignItem:'center', justifyContent:"space-between", pb:2}}>
              <Typography variant="h5" color="initial" sx={{fontWeight:700, pb:1}}>
                Pending Claims
              </Typography>
              <Button variant="contained" color="primary" sx={{width:'150px'}}>
                View All Claims
              </Button>
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
                    {pendingClaims.map((claim)=>(
                      <Row key={claim.claimId} row={claim} />
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
            <Box sx={{display:'flex', alignItem:'center', justifyContent:"space-between", pb:2}}>
              <Typography variant="h5" color="initial" sx={{fontWeight:700, pb:1}}>
                Accepted Claims
              </Typography>
              <Button variant="contained" color="primary" sx={{width:'150px'}}>
                View All Claims
              </Button>
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
                    {acceptedClaims.map((claim)=>(
                      <Row key={claim.claimId} row={claim} />
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
            <Box sx={{display:'flex', alignItem:'center', justifyContent:"space-between", pb:2}}>
              <Typography variant="h5" color="initial" sx={{fontWeight:700, pb:1}}>
                Rejected Claims
              </Typography>
              <Button variant="contained" color="primary" sx={{width:'150px'}}>
                View All Claims
              </Button>
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
                    {rejectedClaims.map((claim)=>(
                      <Row key={claim.claimId} row={claim} />
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
