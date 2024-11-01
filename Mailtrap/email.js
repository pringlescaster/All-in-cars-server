import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { sender, mailtrapClient } from "./mailtrap.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipent = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipent,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log('Error sending verification email', error);
        throw new Error(`Error sending verification email: ${error.message}`); // Now using the caught error
    } 
};
