require('dotenv').config(); // Load environment variables
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

// Security packages
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');

const app = express();

// Set up multer for file upload
const upload = multer({ dest: 'public/uploads/' });

// Middleware
app.use(helmet()); // Add security headers
app.use(xssClean()); // Prevent XSS
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', upload.single('trash-photo'), (req, res) => {
  const accountNumber = req.body['account-number'];
  const nickname = req.body['nickname'];
  const photoPath = req.file ? req.file.path : null;

  // Server-side validation
  if (!nickname || nickname.trim() === '') {
    return res.status(400).send('Nickname is required.');
  }

  if (!accountNumber || accountNumber.trim() === '') {
    return res.status(400).send('Account number is required.');
  }

  if (!photoPath) {
    return res.status(400).send('Photo is required.');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
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
    fs.unlinkSync(photoPath);
    res.send('Submission received! Thank you.');
  });
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    replyTo: email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send message.');
    }
    res.send('Message sent successfully!');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});