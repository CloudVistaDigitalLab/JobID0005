import React, {useState, useEffect} from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

function Row(props) {
  const { row, type } = props;
  const [open, setOpen] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [imageURL, setImageURL] = React.useState(false);

  const handleClickOpenImage = (image) => {
    setImageURL(image);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
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
        <TableCell >{row.clientName}</TableCell>
        <TableCell align="center">{row.vehicleNumber}</TableCell>
        <TableCell align="center">{row.garageName}</TableCell>
        <TableCell align="center">{row.date.split('T')[0]}</TableCell>
        
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
                      <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Note</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow>
                          <TableCell>{row.note}</TableCell>
                      </TableRow>
                  </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom component="div">
                Meadia Uploaded by Garage
              </Typography>
              {row.file && row.file.length > 0? ( 
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <TableRow>
                    {row.file.map((image, index) => (
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
  )
}

export default function Quotations() {
  const [quotations, setQuotations] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:4002/quotations/all')
      .then((response) => {
        const data = response.data.data;
        console.log(data.data)
        setQuotations(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const [quotationsSearch, setQuotationsSearch] = useState('')
  const filteredQuotationsClaims = quotations.filter((item) =>
    Object.values(item).some((value)=>
      value.toString().toLowerCase().includes(quotationsSearch.toLowerCase())
    )
  )

  return (
    <Box sx={{px:2, py:1}}>
      <Box>
        <Typography variant="h4" color="initial" sx={{fontWeight:700, pb:1}}>
          Garage Quotations
        </Typography>
      </Box>
      <Divider sx={{mb:2}}/>
      <Box sx={{display:'flex', alignItem:'center', justifyContent:"space-between", pb:1}}>
        <h2 color="initial" style={{fontWeight:700}}>
          All Quotations
        </h2>
        <TextField 
          id="searchPending" 
          label="Search" 
          variant="outlined" 
          type="text"
          value={quotationsSearch}
          onChange={(e)=>setQuotationsSearch(e.target.value)}
        />
      </Box>
      {quotations && quotations.length > 0?(
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}/>
                <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Claim ID</TableCell>
                <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Vehicle Owner</TableCell>
                <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }}>Vehicle Number</TableCell>
                <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Garage Name</TableCell>
                <TableCell sx={{ backgroundColor: '#2a9d8f', color:'white', fontWeight: 700 }} align="center">Created Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuotationsClaims.map((quotation)=>(
                <Row key={quotation.claimId} row={quotation} type="pending"/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ):(
        <Typography>No Quotations Available</Typography>
      )}
    </Box>
    
  )
}
