import nodemailer from 'nodemailer';

// Use Ethereal Email for development (fake SMTP service)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'test@ethereal.email',
        pass: 'testpassword',
    },
});

export default transporter;
