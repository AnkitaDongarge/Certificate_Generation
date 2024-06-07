const nodemailer = require('nodemailer');

// Load environment variables from .env file
require('dotenv').config();

// Create a nodemailer transporter using the SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function to send email
async function sendEmail(receiverEmail, certificateAttachment) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: receiverEmail,
        subject: 'Your Certificate',
        text: 'Please find your certificate attached below.',
        attachments: [
            {
                filename: 'certificate.pdf', // Change the filename as needed
                content: certificateAttachment, // Certificate attachment content
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

module.exports = { sendEmail };
