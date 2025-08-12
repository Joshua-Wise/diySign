const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Admin authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const app = express();
const PORT = process.env.PORT || 3000;

// Path to campuses data file
const CAMPUSES_FILE = path.join(__dirname, '../public/data/campuses.json');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/images/logos');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Use a timestamp to ensure unique filenames
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + ext);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper functions for campus data
function readCampusesData() {
  try {
    if (!fs.existsSync(CAMPUSES_FILE)) {
      // If file doesn't exist, create it with default data
      const defaultData = { campuses: [] };
      fs.writeFileSync(CAMPUSES_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    
    const data = fs.readFileSync(CAMPUSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading campuses data:', error);
    return { campuses: [] };
  }
}

function writeCampusesData(data) {
  try {
    // Ensure the directory exists
    const dir = path.dirname(CAMPUSES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(CAMPUSES_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing campuses data:', error);
    return false;
  }
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Simple authentication middleware
const requireAuth = (req, res, next) => {
  // In a real application, this would check a session or token
  // For simplicity, we're using a custom header
  const isAuthenticated = req.headers['x-auth-token'] === ADMIN_PASSWORD;
  
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Authentication API route
app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  
  // In a real application, this would check against a hashed password in a database
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

// Campus API routes
app.get('/api/campuses', (req, res) => {
  const data = readCampusesData();
  res.json(data);
});

app.post('/api/campuses', requireAuth, (req, res) => {
  try {
    const data = readCampusesData();
    const newCampus = req.body;
    
    // Validate required fields
    if (!newCampus.id || !newCampus.name || !newCampus.organization || !newCampus.address || !newCampus.phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if campus with this ID already exists
    const existingIndex = data.campuses.findIndex(c => c.id === newCampus.id);
    if (existingIndex !== -1) {
      return res.status(409).json({ error: 'Campus with this ID already exists' });
    }
    
    // Add new campus
    data.campuses.push(newCampus);
    
    // Save data
    if (writeCampusesData(data)) {
      res.status(201).json({ success: true, campus: newCampus });
    } else {
      res.status(500).json({ error: 'Failed to save campus data' });
    }
  } catch (error) {
    console.error('Error creating campus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/campuses/:id', requireAuth, (req, res) => {
  try {
    const data = readCampusesData();
    const campusId = req.params.id;
    const updatedCampus = req.body;
    
    // Validate required fields
    if (!updatedCampus.name || !updatedCampus.organization || !updatedCampus.address || !updatedCampus.phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Find campus index
    const campusIndex = data.campuses.findIndex(c => c.id === campusId);
    if (campusIndex === -1) {
      return res.status(404).json({ error: 'Campus not found' });
    }
    
    // Update campus (preserve the original ID)
    updatedCampus.id = campusId;
    data.campuses[campusIndex] = updatedCampus;
    
    // Save data
    if (writeCampusesData(data)) {
      res.json({ success: true, campus: updatedCampus });
    } else {
      res.status(500).json({ error: 'Failed to save campus data' });
    }
  } catch (error) {
    console.error('Error updating campus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/campuses/:id', requireAuth, (req, res) => {
  try {
    const data = readCampusesData();
    const campusId = req.params.id;
    
    // Find campus index
    const campusIndex = data.campuses.findIndex(c => c.id === campusId);
    if (campusIndex === -1) {
      return res.status(404).json({ error: 'Campus not found' });
    }
    
    // Remove campus
    data.campuses.splice(campusIndex, 1);
    
    // Save data
    if (writeCampusesData(data)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to save campus data' });
    }
  } catch (error) {
    console.error('Error deleting campus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logo upload API route
app.post('/api/upload-logo', requireAuth, upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the path to the uploaded file (relative to the public directory)
    const logoPath = `images/logos/${req.file.filename}`;
    res.json({ 
      success: true, 
      logoPath: logoPath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

// Get available logos API route
app.get('/api/logos', (req, res) => {
  try {
    const logosDir = path.join(__dirname, '../public/images/logos');
    
    // Ensure the directory exists
    if (!fs.existsSync(logosDir)) {
      fs.mkdirSync(logosDir, { recursive: true });
    }
    
    // Read the directory
    const files = fs.readdirSync(logosDir);
    
    // Filter for image files
    const logoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext);
    });
    
    // Create paths relative to the public directory
    const logoPaths = logoFiles.map(file => `images/logos/${file}`);
    
    res.json({ success: true, logos: logoPaths });
  } catch (error) {
    console.error('Error getting logos:', error);
    res.status(500).json({ error: 'Failed to get logos' });
  }
});

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Serve the admin HTML file for the admin route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Visit http://localhost:${PORT} to access the application`);
  }
});
