import hbs from "hbs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import SendEmail from "../../utils/SendEmail.js";
import UserEmail from "../../utils/UserEmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadTemplate = (templateName, replacement) => {
  const templatePath = path.join(__dirname, "emailTemplate", templateName);
  const source = fs.readFileSync(templatePath, "utf-8");
  return hbs.compile(source)(replacement);
};

const sendAssessment = async (req, res) => {
  const { name, email, mobile, score, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;

  // Format answers for the template
  const format = (val) => (val == "10" ? "Yes" : "No");
  const templateData = {
    name, email, mobile, score,
    q1: format(q1), q2: format(q2), q3: format(q3), q4: format(q4), q5: format(q5),
    q6: format(q6), q7: format(q7), q8: format(q8), q9: format(q9), q10: format(q10)
  };

  const AdminHtmlTemplate = loadTemplate("emailTemplate.hbs", templateData);

  try {
    // 1. Send to Admin (Using 'support' type or 'advance' depending on your need)
    await SendEmail({
      type: "support", 
      subject: `New Assessment Submitted by ${name}`,
      html: AdminHtmlTemplate
    });

    // 2. Send simple notification to the User
    await UserEmail({
      type: "support",
      email: email,
      subject: "Assessment Received",
      html: `<h2>Hello ${name},</h2><p>We have successfully received your assessment. Your score is <b>${score}</b>. Our team will review it and get back to you soon.</p>`
    });

    res.status(200).json({ success: true, message: "Assessment sent successfully" });
  } catch (error) {
    console.error("Assessment Error:", error);
    res.status(500).json({ success: false, message: "Failed to send assessment email" });
  }
};

export default sendAssessment;