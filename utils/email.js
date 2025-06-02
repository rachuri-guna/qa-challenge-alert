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

    // ✅ Clean + indent all lines to prevent heading formatting in Gmail
    const cleanedText = textBody
      .replace(/^###\s*/gm, '')          // Remove markdown headers
      .replace(/^(\S.*)$/gm, '  $1');    // Add 2-space indent to all content lines

    const info = await transporter.sendMail({
      from: `"QA Challenge Alert" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject,
      text: cleanedText,
      html: `<pre style="font-family: monospace; white-space: pre-wrap;">${cleanedText}</pre>`,
    });

    console.log(`✅ Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
}
