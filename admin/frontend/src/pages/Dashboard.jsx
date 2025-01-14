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
  useEffect(() => {
        axios
            .get('http://localhost:4002/getClaims')
            .then((response) => {
                const reversedClaims = response.data.reverse(); // Sort in descending order
                const lastFourClaims = reversedClaims.slice(0, 4); // Get the first 4 items after sorting
                setClaims(lastFourClaims); // Set the state
            }) // Ensure proper variable usage
            .catch((err) => console.log(err));
  }, []);

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
    </Box>
  )
}
