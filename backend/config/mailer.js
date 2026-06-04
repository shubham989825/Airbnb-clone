import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
    },
});

export default transporter;
