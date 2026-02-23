const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema
const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Email Transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Routes
app.post('/api/contact', async (req, res) => {
    const { first_name, last_name, email, phone, message } = req.body;

    try {
        // 1. Store in Database
        const newContact = new Contact({
            firstName: first_name,
            lastName: last_name,
            email,
            phone,
            message
        });
        await newContact.save();

        // 2. Send Real-time Email Alert to Admin
        const adminEmailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: `🚀 New Contact Form Submission from ${first_name} ${last_name}`,
            text: `
        Name: ${first_name} ${last_name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `
        };

        // 3. Send Auto-Reply to User
        const userEmailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for reaching out to SYNEROM HEX',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2 style="color: #8b5cf6;">Successfully Submitted!</h2>
          <p>Hi ${first_name},</p>
          <p>Thank you for contacting <strong>SYNEROM HEX</strong>. We have received your message and stored your details in our secure database.</p>
          <p>Please wait for a response from our team. We will get back to you shortly.</p>
          <br>
          <p>Best regards,<br>The SYNEROM HEX Team</p>
        </div>
      `
        };

        // Send both emails
        await transporter.sendMail(adminEmailOptions);
        await transporter.sendMail(userEmailOptions);

        res.status(200).json({ message: 'Success! Data stored and emails sent.' });

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ error: 'Failed to process request. Check server logs.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
