const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/send-email', upload.array('attachments'), async (req, res) => {
    const { email, subject, message } = req.body;
    const attachments = req.files.map(file => ({
        filename: file.originalname,
        path: file.path
    }));

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yesyesomegachad@gmail.com',
            pass: 'Sunelis123'
        }
    });

    let mailOptions = {
        from: 'yesyesomegachad@gmail.com',
        to: email,
        subject: subject,
        text: message,
        attachments: attachments
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Email sent successfully!');
    } catch (error) {
        console.error(error);
        res.send('Failed to send email.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
