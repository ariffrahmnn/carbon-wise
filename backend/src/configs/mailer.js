import nodemailer from 'nodemailer';

// Konfigurasi "Tukang Pos"
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export default transporter;