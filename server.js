const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const Certificate = require('./public/JS/certificateSchema');
require('dotenv').config();

const mongoDB = process.env.MONGODB_URI || 'your_default_mongodb_uri_here';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('Failed to connect to MongoDB', err);
    });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve create.html as the default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

app.post('/verify-password', (req, res) => {
    const { password } = req.body;
    const leadPassword = process.env.LEAD_PASSWORD.toLowerCase();

    if (password.toLowerCase() === leadPassword) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Incorrect password' });
    }
});

app.post('/save-certificates', async (req, res) => {
    const certificates = req.body.certificates;

    try {
        const savedCertificates = await Certificate.insertMany(certificates);
        res.status(200).json({ success: true, certificates: savedCertificates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving certificates', error });
    }
});

app.post('/validate-certificate', async (req, res) => {
    const { certID } = req.body;

    try {
        // Check if a certificate with the given certID exists in the database
        const certificate = await Certificate.findOne({ certID });

        if (certificate) {
            res.status(200).json({ valid: true, message: 'Certificate ID matches.' });
        } else {
            res.status(404).json({ valid: false, message: 'Certificate ID not found.' });
        }
    } catch (error) {
        res.status(500).json({ valid: false, message: 'Error validating certificate.', error });
    }
});
app.get('/certificates', async (req, res) => {
    try {
        const certificates = await Certificate.find({});
        res.status(200).json(certificates);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching certificates', error });
    }
});
app.delete('/certificates/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Certificate.findByIdAndDelete(id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting certificate', error });
    }
});

// New route to serve certificate based on ID
app.get('/c/:certID', async (req, res) => {
    const { certID } = req.params;

    try {
        // Find the certificate with the given certID
        const certificate = await Certificate.findOne({ certID });

        if (!certificate) {
            return res.status(404).send('Certificate not found');
        }

        // Render the certificate HTML with the certificate data
        res.send(`
                                    <html>
                <head>
                    <title>Certificate - ${certificate.name}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            background-color: #f0f0f0;
                        }
                        #certificateDisplay {
                            width: 800px;
                            height: 600px;
                            border: 1px solid #ccc;
                        }
                        button {
                            background-color: #007bff;
                            color: white;
                            border: none;
                            cursor: pointer;
                            font-size: 16px;
                            margin-left: 275px;
                            padding: 2px;
                            border-radius: 5px;
                            margin-top: 5px;
                        }
                        
                        button:hover {
                            background-color: #0056b3;
                        }
                    </style>

                </head>
                <body>
                    <h3 id="name">${certificate.name}</h3>
                    <h3 id="certid">${certificate.certID}</h3>
                    <div id="certificateDisplay">
                        <svg id="certificateTemplate" viewBox="0 0 800 600">
                            <!-- Background -->
                            <rect x="0" y="0" width="800" height="600" fill="#f7f7f7" />
                            
                            <!-- Border -->
                            <rect x="25" y="25" width="750" height="550" fill="none" stroke="#000" stroke-width="3" />
                            
                            <!-- Decorative elements -->
                            <rect x="50" y="50" width="700" height="500" fill="none" stroke="#666" stroke-dasharray="10,5" />
                            <line x1="50" y1="100" x2="750" y2="100" stroke="#666" stroke-width="1" />

                            <!-- Text content -->
                            <text x="400" y="90" font-size="30" text-anchor="middle" fill="#333">Certificate of Course Completion</text>
                            <text x="400" y="170" font-size="20" text-anchor="middle" fill="#555">This is to certify that</text>
                            <text x="400" y="220" font-size="40" text-anchor="middle" fill="#000">${certificate.name}</text>
                            <text x="400" y="270" font-size="20" text-anchor="middle" fill="#555">has successfully completed the course</text>
                            <text x="400" y="320" font-size="20" text-anchor="middle" fill="#555">from GDSC Club</text>
                            <text id="dateText" x="400" y="400" font-size="20" text-anchor="middle" fill="#000">${new Date(certificate.date).toLocaleDateString()}</text>
                            
                            <!-- Signature lines -->
                            <line x1="200" y1="450" x2="300" y2="450" stroke="#000" />
                            <line x1="500" y1="450" x2="600" y2="450" stroke="#000" />
                            <text x="250" y="470" font-size="15" text-anchor="middle" fill="#555">Instructor</text>
                            <text x="550" y="470" font-size="15" text-anchor="middle" fill="#555">Coordinator</text>

                            <!-- Certificate ID -->
                            <text id="certID" x="400" y="540" font-size="15" text-anchor="middle" fill="#555">Certificate ID: ${certificate.certID}</text>
                        </svg>
                        <br>
                        <button id="downloadBtn">Download Png certificate here!!!</button>
                    </div>
                    <script src="/JS/downloadcert.js"></script>
                </body>
                
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error retrieving certificate');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

