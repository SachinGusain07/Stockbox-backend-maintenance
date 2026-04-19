import hbs from "hbs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import SendEmail from "../../utils/SendEmail.js";
import UserEmail from "../../utils/UserEmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadTemplate = (templateName, replacement) => {
  const templatePath = path.join(__dirname, ".." ,  "emailTemplate", templateName);
  const source = fs.readFileSync(templatePath, "utf-8");
  return hbs.compile(source)(replacement);
};

const sendAssessment = async (req, res) => {
  // 1. Extract data (Handling both flat and nested 'answers' object)
  const { name, email, mobile, score } = req.body;
  
  // Use data from req.body.answers if it exists, otherwise use req.body
  const sourceData = req.body.answers ? req.body.answers : req.body;

  const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = sourceData;

  // 2. Improved format function (handles numbers and strings)
  const format = (val) => (String(val) === "10" ? "Yes" : "No");

  const templateData = {
    name,
    email,
    mobile,
    score, // This is the score (e.g., 50)
    q1: format(q1),
    q2: format(q2),
    q3: format(q3),
    q4: format(q4),
    q5: format(q5),
    q6: format(q6),
    q7: format(q7),
    q8: format(q8),
    q9: format(q9),
    q10: format(q10)
  };

  const AdminHtmlTemplate = loadTemplate("advanceTrainingTest.hbs", templateData);

  try {
    // 1. Send to Admin
    await SendEmail({
      type: "advance", 
      subject: `New Advance Assessment Submitted by ${name}`,
      html: AdminHtmlTemplate
    });

    // 2. Send to User (Score is included in the template literal below)
    await UserEmail({
      type: "advance",
      email: email,
      subject: "Advance Assessment Received",
      // Using backticks `` for template literals to inject the ${score} variable
      html: `
        <div style="font-family: sans-serif;">
          <h2>Hello ${name},</h2>
          <p>We have successfully received your assessment.</p>
          <p style="font-size: 18px;">Your Total Score is: <strong style="color: #2ecc71;">${score}</strong></p>
          <p>Our team will review your answers and get back to you soon.</p>
          <br/>
          <p>Regards,<br/>Training Team</p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: "Assessment sent successfully" });
  } catch (error) {
    console.error("Assessment Error:", error);
    res.status(500).json({ success: false, message: "Failed to send assessment email" });
  }
};

export default sendAssessment;