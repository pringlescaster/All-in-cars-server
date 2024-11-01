import { MailtrapClient } from "mailtrap";

import dotenv from "dotenv";

dotenv.config();


export const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAILTRAP_ENDPOINT,
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Ayantoye David",
};

//This is commented out because we are sending mails to different users
// const recipients = [
//   {
//     email: "pringlescaster@gmail.com",
//   },
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     html: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);

