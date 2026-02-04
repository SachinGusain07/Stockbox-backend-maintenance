


import hbs from "hbs";
import SendEmail from "../utils/SendEmail.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import UserEmail from "../utils/UserEmail.js";

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadTemplate = (templateName, replacement) => {
  const templatePath = path.join(__dirname, "emailTemplate", templateName);
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = hbs.compile(source);
  return template(replacement);
};

const email = async (req, res, next) => {
  const { email, name, subject, message, phone, title } = req.body;
  const pdf = req.file;
  console.log(pdf , "this is pdf")

  const AdminHtmlTemplate = loadTemplate("emailTemplate.hbs", {
    title: title.title,
    name: `from ${name}`,
    subject,
    email,
    message,
    phone,
  });

  const UserHtmlTemplate = loadTemplate("emailTemplate.hbs", {
    title: title.title,
    name: `Hii ,${name}`,
    subject: "Regarding your email To Stockbox",
    email: "Stockbox@gmail.com",
    message: ` Hello ${name} , We have received your email and we will get back to you soon Thank you for contacting us.`,
    phone: "73829474923",
  });

  try {
    // ✅ Prepare attachment only if PDF exists
    const attachments = pdf
      ? [
          {
            filename: pdf.originalname,
            content: pdf.buffer,
            contentType: pdf.mimetype,
          },
        ]
      : [];


      console.log(attachments , "attachments")
    // Send email to stockbox customer service
    await SendEmail({
      email,
      subject,
      text: `Message from ${email}: ${message}. Contact: ${phone}`,
      html: AdminHtmlTemplate,
      ...(attachments.length > 0 && { attachments }), // ✅ attach only if available
    });

    // Send email to the user
    await UserEmail({
      email,
      subject: "Regarding your query from Stockbox",
      text: "Thank you for contacting us! We will get back to you soon.",
      html: UserHtmlTemplate,
    });

    console.log("Emails sent successfully");
    res
      .status(200)
      .json({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
};

export default email;

