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


export const sendBookingConfirmationEmail = async (email, carName, date) => {
    const subject = "Booking Confirmation";
    const html = `<p>Your booking for ${carName} on ${date} has been confirmed.</p>`;
    await sendEmail(email, subject, html);
  };
