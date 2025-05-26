import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateMapping = {
  emailVerification: path.join(
    __dirname,
    "templates",
    "emailVerification.html"
  ),
  loginOtp: path.join(__dirname, "templates", "loginOtp.html"),
  passwordReset: path.join(__dirname, "templates", "passwordReset.html"),
};

const renderTemplate = (templatePath, data) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, (err, str) => {
      if (err) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });
};

const sendEmail = async (to: string, MessageChannel: string, type: string) => {
  try {
    const templatePath = templateMapping[type];

    if (!templatePath) {
      throw new Error(`Invalid email type: ${type}`);
    }

    const html = await renderTemplate(templatePath, "Welcome to our service!");
    const mailOptions = {
      from: process.env.EMAIL_USER!,
      to,
      subject: MessageChannel,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};

export default sendEmail;
