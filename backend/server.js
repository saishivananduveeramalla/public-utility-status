/**
 * PUBLIC UTILITY STATUS - BACKEND SERVER (Node.js & Express.js)
 * Course: Essentials of Web Programming (EWP) Lab Project
 * Port: 3000
 */

const express = require('express');
const cors = require('cors');
const { utilities, announcements, complaints } = require('./data');

const app = express();
const PORT = 3000;

// Enable CORS for Angular frontend (http://localhost:4200)
app.use(cors({
  origin: '*', // Allow all origins for simple student lab evaluation
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Parse JSON request bodies
app.use(express.json());

// Request logger middleware to help students see incoming API calls in terminal
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "Public Utility Status API is running!",
    endpoints: {
      utilities: "GET /api/utilities",
      utilityById: "GET /api/utilities/:id",
      announcements: "GET /api/announcements",
      complaints: "GET /api/complaints",
      complaintById: "GET /api/complaints/:id",
      submitComplaint: "POST /api/complaints"
    }
  });
});

// 1. GET /api/utilities - Return all 6 utilities
app.get('/api/utilities', (req, res) => {
  res.status(200).json(utilities);
});

// 2. GET /api/utilities/:id - Return a specific utility
app.get('/api/utilities/:id', (req, res) => {
  const utilityId = req.params.id.trim().toUpperCase();
  const found = utilities.find(u => u.id.toUpperCase() === utilityId);
  
  if (!found) {
    return res.status(404).json({ error: `Utility with ID '${req.params.id}' not found.` });
  }
  
  res.status(200).json(found);
});

// 3. GET /api/announcements - Return all announcements
app.get('/api/announcements', (req, res) => {
  res.status(200).json(announcements);
});

// 4. GET /api/complaints - Return all complaints (sample + in-memory registered)
app.get('/api/complaints', (req, res) => {
  res.status(200).json(complaints);
});

// 5. GET /api/complaints/:id - Return a complaint by its complaint ID
app.get('/api/complaints/:id', (req, res) => {
  const searchId = req.params.id.trim().toUpperCase();
  const found = complaints.find(c => c.complaintId.toUpperCase() === searchId);

  if (!found) {
    return res.status(404).json({ error: `Complaint ID '${req.params.id}' not found.` });
  }

  res.status(200).json(found);
});

// 6. POST /api/complaints - Validate complaint data and save in memory
app.post('/api/complaints', (req, res) => {
  const { citizenName, mobile, email, utilityCategory, area, description } = req.body;

  // Validation: Check required fields
  if (!citizenName || !mobile || !email || !utilityCategory || !area || !description) {
    return res.status(400).json({
      error: "All fields are required: citizenName, mobile, email, utilityCategory, area, description."
    });
  }

  // Validation: Name length
  if (citizenName.trim().length < 3) {
    return res.status(400).json({
      error: "Citizen name must be at least 3 characters long."
    });
  }

  // Validation: 10-digit mobile number
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile.trim())) {
    return res.status(400).json({
      error: "Mobile number must be exactly 10 numeric digits."
    });
  }

  // Validation: Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      error: "Please provide a valid email address (e.g. citizen@example.com)."
    });
  }

  // Validation: Description length
  if (description.trim().length < 15) {
    return res.status(400).json({
      error: "Complaint description must be at least 15 characters long."
    });
  }

  // Generate unique complaint ID: CMP-HYD-2026-XXXX
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const complaintId = `CMP-HYD-2026-${randomSuffix}`;

  const newComplaint = {
    complaintId: complaintId,
    citizenName: citizenName.trim(),
    mobile: mobile.trim(),
    email: email.trim(),
    utilityCategory: utilityCategory.trim(),
    area: area.trim(),
    description: description.trim(),
    status: 'Submitted',
    submittedAt: new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  };

  // Add to in-memory array (prepended so newest shows first)
  complaints.unshift(newComplaint);

  console.log(`[SUCCESS] New complaint registered with ID: ${complaintId}`);

  res.status(201).json({
    message: "Complaint successfully registered on Express backend!",
    complaint: newComplaint
  });
});

// Start Express server on port 3000
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  PUBLIC UTILITY STATUS - EXPRESS BACKEND API`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  CORS enabled for Angular frontend (http://localhost:4200)`);
  console.log(`=======================================================`);
});
