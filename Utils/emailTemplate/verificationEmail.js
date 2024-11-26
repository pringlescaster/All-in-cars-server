import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS 
    }

});

export const sendEmail = async(to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"All In Cars" <${process.env.SMTP_USER}>`, //sender address
            to,
            subject,
            html,
        })
    } catch (error) {
        console.error("Error sending mail", error);
        throw new Error("Failed to send email");
    }
}

export const sendVerificationEmail = async (email, code) => {
    const subject = "Email Verification";
    const html = `<p>Thank you for signing up. Please use the verification code below:</p>
    <h3>${code}</h3>`;
    await sendEmail(email, subject, html);
};