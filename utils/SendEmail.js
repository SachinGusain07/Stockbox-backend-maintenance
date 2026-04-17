// import nodemailer from "nodemailer";

// const SendEmail = async (options) => {
//   try {
//     if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
//       throw new Error("Missing email credentials in environment variables.");
//     }

//     // Create a transporter
//   const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,            // or 587 for STARTTLS
//   secure: true,         // true for port 465, false for 587
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   }
// });

//     // Define the email options
//    const mailOptions = {
//   from: `"StockBox Customer Service" <${process.env.EMAIL_USERNAME}>`,
//   to: process.env.ADMIN_EMAIL,
//   subject: options.subject,
//   text: options.text || "",
//   html: options.html || "",
//   ...(options.attachments && { attachments: options.attachments }), // ✅ only add if present
// };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`Email sent: ${info.messageId}`);

//     return { success: true, message: "Email sent successfully" };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return { success: false, message: "Email sending failed", error };
//   }
// };

// export default SendEmail;



import nodemailer from "nodemailer";
import { getTransporterConfig } from "./emailConfig.js";

const SendEmail = async (options) => {
  try {
    const type = options.type || "support";
    const config = getTransporterConfig(type);

    const transporter = nodemailer.createTransport(config);

    const mailOptions = {
      from: `"StockBox Admin" <${config.auth.user}>`,
      to: process.env.ADMIN_EMAIL, // Or customize based on type if needed
      subject: options.subject,
      text: options.text || "",
      html: options.html || "",
      ...(options.attachments && { attachments: options.attachments }),
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Email sending failed", error };
  }
};
export default SendEmail;