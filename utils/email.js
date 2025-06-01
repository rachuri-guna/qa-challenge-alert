import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function sendEmail(subject, textBody) {
  console.log('📨 Preparing to send email...');

  const { EMAIL_USER, EMAIL_PASS, EMAIL_TO } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
    console.warn('⚠️ Missing email environment variables. Email not sent.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"QA Challenge Alert" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject,
      text: textBody,
    });

    console.log(`✅ Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
}
