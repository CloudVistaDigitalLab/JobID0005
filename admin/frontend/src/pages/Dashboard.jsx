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
import Card from '@mui/material/Card';
import axios from 'axios'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
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
            <Button color="error" variant="contained">Reject</Button>
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
      </React.Fragment>
    );
}

export default function Dashboard() {
  const [claims, setClaims] = useState([])
  const [allClaims, setAllClaims] = useState([])

  const pendingClaim = allClaims.filter(claim => claim.status === "Pending");
  const acceptedClaim = allClaims.filter(claim => claim.status === "Accepted");
  const rejectedClaim = allClaims.filter(claim => claim.status === "Rejected");
  useEffect(() => {
    axios
      .get('http://localhost:4002/getClaims')
      .then((response) => {
        const reversedClaims = response.data.reverse(); // Sort in descending order
        const lastFourClaims = reversedClaims.slice(0, 4); // Get the first 4 items after sorting
        setClaims(lastFourClaims); // Set the state
        setAllClaims(response.data); // Set the state
      }) // Ensure proper variable usage
      .catch((err) => console.log(err));
  }, []);

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  
  const todayClaims = allClaims.filter(claim => claim.incidentDate.split('T')[0] === "2025-01-02");

  const createPastDatesArray = (datesCount) => {
    const datesArray = [];
    const today = new Date();
  
    for (let i = 0; i < datesCount; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      const formattedDate = pastDate.toISOString().split('T')[0];
      datesArray.push(formattedDate);
    }
  
    return datesArray;
  };
  
  const createPastDaysArray = (daysCount) => {
    const daysArray = [];
    const today = new Date();
  
    for (let i = 0; i < daysCount; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      const formattedDate = pastDate.toISOString().split('T')[0];
      const formattedDay = pastDate.toISOString().slice(8,10)
      daysArray.push(formattedDay);
    }
  
    return daysArray;
  };
  
  const past5Dates = createPastDatesArray(5);
  const past5Days = createPastDaysArray(5);

  const claimsCount = past5Dates.map((date) => {
    return allClaims.filter((claim) => {
      const claimDate = new Date(claim.createdAt);
      return claimDate.toISOString().split('T')[0] === date;
    }).length;
  });

  const nextDay = Math.max(...past5Days.map(Number)) + 1;

  const [predictedData, setPredictedData] = useState()

  const handlePredictClick = async () => {
    const endpoint = "http://127.0.0.1:8000/predict";
    const requestBody = {
      days: past5Days,
      claims: claimsCount,
      next_day: nextDay,
    };

    try {
      const response = await axios.post(endpoint, requestBody);
      setTimeout(() => {
        setPredictedData(response.data);
        console.log("Prediction Response:", response.data);
      }, 3000);
    } catch (error) {
      console.error("Error calling the predict endpoint:", error.response?.data || error.message);
      alert("Failed to fetch prediction. Check console for details.");
    }
  };
  
  const [openPredict, setOpenPredict] = React.useState(false);
  const handleClickOpenPredict = () => {
    handlePredictClick();
    setOpenPredict(true);
  };

  const handleClosePredict = () => {
    setOpenPredict(false);
  };

  return (
    <Box sx={{px:2, py:1}}>
      <Box>
        <Typography variant="h4" color="initial" sx={{fontWeight:700, pb:1}}>
          Dashboard
        </Typography>
      </Box>
      <Divider/>
      <Box sx={{py:2}}>
        <Box sx={{display:'flex', alignItem:'center', justifyContent:"space-between", pb:2}}>
          <Typography variant="h5" color="initial" sx={{fontWeight:700, pb:1}}>
            Recent Claims
          </Typography>
          <Button variant="contained" color="primary" sx={{width:'150px'}}>
            View All Claims
          </Button>
        </Box>
          
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
              {claims.map((claim)=>(
                <Row key={claim.claimId} row={claim} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Divider/>
      <Box sx={{my:2, display:'flex', justifyContent:'space-between'}}>
        <Card sx={{p:2, display:'flex', flexDirection:'column', alignItems:'center'}}>
          <Typography variant="h5"># All Clams</Typography>
          <Typography variant="h1" sx={{color:'#2a9d8f'}}>{allClaims.length}</Typography>
        </Card>
        <Card sx={{p:2, display:'flex', flexDirection:'column', alignItems:'center'}}>
          <Typography variant="h5"># Pending Clams</Typography>
          <Typography variant="h1" sx={{color:'#2a9d8f'}}>{pendingClaim.length}</Typography>
        </Card>
        <Card sx={{p:2, display:'flex', flexDirection:'column', alignItems:'center'}}>
          <Typography variant="h5"># Accepted Clams</Typography>
          <Typography variant="h1" sx={{color:'#2a9d8f'}}>{acceptedClaim.length}</Typography>
        </Card>
        <Card sx={{p:2, display:'flex', flexDirection:'column', alignItems:'center'}}>
          <Typography variant="h5"># Rejected Clams</Typography>
          <Typography variant="h1" sx={{color:'#2a9d8f'}}>{rejectedClaim.length}</Typography>
        </Card>
      </Box>
      <Divider/>
      <Box sx={{mt:2, display:'flex', justifyContent:'space-between', gap:3}}>
        <Card sx={{p:2, display:'flex', flexDirection:'column', alignItems:'center', width:'50%'}}>
          <Typography variant="h5">No. of Claims for Today</Typography>
          <Typography variant="h1" sx={{color:'#2a9d8f'}}>{todayClaims.length}</Typography>
        </Card>
        <Card sx={{p:2, display:'flex', flexDirection:'column', alignItems:'center', width:'50%'}}>
          <Typography variant="h5" sx={{mb:2}}>No. of Claims that can be Crated Tomorrow</Typography>
          <Button variant="contained" onClick={handleClickOpenPredict}>
            Predict
          </Button>
        </Card>
      </Box>
      <Dialog
        open={openPredict}
        onClose={handleClosePredict}
        sx={{width: '100%', height: '100%'}}
        
      >
        <DialogTitle sx={{display:'flex', justifyContent:'space-between', alignItem:'center'}}>
          No. of Claims Prediction for Tomorrow
          
        </DialogTitle>
        <DialogContent>
          {predictedData?(
            <Box sx={{mb:1}}>
              {predictedData.predicted_claims} cliams can be filed by the users tomorrow
            </Box>
          ):(
            <Box sx={{display:'flex', alignItems:'center', gap:2, justifyContent:'center'}}>
              <CircularProgress />
              <Typography>Predicting...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePredict}>close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
