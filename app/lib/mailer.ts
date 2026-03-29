import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendLeadNotification = async (partnerEmail: string, partnerName: string, formData: Record<string, string>) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || 'Formile Clone';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const tableRows = Object.entries(formData)
    .map(([key, value]) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">${key.replace(/_/g, ' ').toUpperCase()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${value}</td>
      </tr>
    `)
    .join('');

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: #f97316; padding: 20px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Lead Captured!</h1>
        <p style="margin: 5px 0 0; opacity: 0.8;">Campaign: ${partnerName}</p>
      </div>
      <div style="padding: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${tableRows}
        </table>
        <div style="margin-top: 25px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/admin/dashboard" style="background: #000; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View in Dashboard</a>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: `${adminEmail}, ${partnerEmail}`,
      subject: `🔥 New Lead for ${partnerName}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
};

export const sendUserConfirmation = async (userEmail: string, heading: string) => {
  const fromName = process.env.SMTP_FROM_NAME || 'Formile Clone';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; padding: 30px; text-align: center;">
      <div style="font-size: 40px; margin-bottom: 20px;">✅</div>
      <h1 style="color: #333; margin-bottom: 10px;">Thank You!</h1>
      <p style="color: #666; font-size: 16px; line-height: 1.5;">
        Your submission for <b>${heading}</b> was successful. We have received your information and will get back to you shortly.
      </p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px;">This is an automated confirmation from ${fromName}.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: userEmail,
      subject: `Confirmation: ${heading}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
};
