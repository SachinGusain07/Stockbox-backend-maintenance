// import nodemailer from "nodemailer";

// const UserEmail = async (options) => {
//   try {
//     if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
//       throw new Error("Missing email credentials in environment variables.");
//     }

//     // Create a transporter
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // Use TLS
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     // Define the email options
//     const mailOptions = {
//       from: `"StockBox Customer Service" <${process.env.EMAIL_USERNAME}>`, // Properly formatted sender
//       to:options.email, // Use dynamic recipient from options
//       subject:"Regarding your query from Stockbox",
//       text: "Thank you for contacting us! We will get back to you soon." || "", // Ensure text is optional
//       html: options.html || "", // Ensure HTML is optional
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`Email sent: ${info.messageId}`);

//     return { success: true, message: "Email sent successfully" };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return { success: false, message: "Email sending failed", error };
//   }
// };

// export default UserEmail;

import nodemailer from "nodemailer";
import { getTransporterConfig } from "./emailConfig.js";

const UserEmail = async (options) => {
  try {
    const type = options.type || "support";
    const config = getTransporterConfig(type);

    const transporter = nodemailer.createTransport(config);

    const mailOptions = {
      from: `"StockBox Customer Service" <${config.auth.user}>`,
      to: options.email, 
      subject: options.subject || "Regarding your query from Stockbox",
      text: options.text || "Thank you for contacting us!",
      html: options.html || "",
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Email sending failed", error };
  }
};
export default UserEmail;
