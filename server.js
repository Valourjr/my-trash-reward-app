require('dotenv').config(); // This will load the environment variables
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Set up multer for file upload (for the main form)
const upload = multer({ dest: 'public/uploads/' });

// Middleware to parse JSON bodies and enable CORS
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve the static HTML and files (for both forms)
app.use(express.static('public'));

// Setup nodemailer with secure Gmail settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,           // Use 465 for SSL
  secure: true,        // True for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route: Serve the form (main form and contact form)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Handle main form submission with file upload
app.post('/submit', upload.single('trash-photo'), (req, res) => {
  const accountNumber = req.body['account-number'];
  const nickname = req.body['nickname'];
  const photoPath = req.file ? req.file.path : null;

  // Basic validation for the form
  if (!nickname || nickname.trim() === '') {
    return res.status(400).send('Nickname is required.');
  }

  if (!photoPath) {
    return res.status(400).send('Photo is required.');
  }

  const mailOptions = {
    from: `je161892@gmail.com`,
    to: `je161892@gmail.com`,
    subject: `Trash Submission Received`,
    text: `New trash submission:\nNickname: ${nickname}\nAccount Number: ${accountNumber}`,
    attachments: [
      {
        filename: req.file.originalname,
        path: photoPath
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email Error:', error);
      return res.status(500).send('Error sending email.');
    }
    fs.unlinkSync(photoPath); // Delete file after sending
    res.send('Submission received! Thank you.');
  });
});

// Route: Handle contact form submission (without file upload)
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  const mailOptions = {
    from: `${name} <${email}>`,
    to: `je161892@gmail.com`,  // Replace with your email address
    subject: `New Contact Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send message.');
    }
    res.send('Message sent successfully!');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;  // Use Render's environment variable for port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});