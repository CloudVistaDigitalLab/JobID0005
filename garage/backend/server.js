
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const AuthRouter = require('./routes/AuthRouter');
const GarageRouter = require('./routes/GarageRouter')



require('dotenv').config();
require('./models/db');

const PORT = process.env.PORT || 4000;


const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Routers
app.use('/auth', AuthRouter);
app.use('/api',GarageRouter);



// Ping route for testing
app.get('/ping', (req, res) => {
  res.send('PONG');
});



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});



