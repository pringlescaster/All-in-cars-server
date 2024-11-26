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


export const sendPasswordResetEmail = async (email, resetLink) => {
    const subject = "Password Reset Request";
    const html = `<p>You requested a password reset. Click the link below to reset your password:</p>
                  <a href="${resetLink}">${resetLink}</a>`;
    await sendEmail(email, subject, html);
  };