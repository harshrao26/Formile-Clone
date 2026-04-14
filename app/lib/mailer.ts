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
  const fromName = process.env.SMTP_FROM_NAME || 'ZeeOffer';
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
        <div style="margin-top: 25px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
          <a href="${(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')}/admin/dashboard" style="background: #000; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View in Dashboard</a>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            A product by <a href="https://www.genforgestudio.com/" style="color: #f97316; font-weight: bold; text-decoration: underline;">GenForge Studio</a>
          </p>
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
  const fromName = process.env.SMTP_FROM_NAME || 'ZeeOffer';
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
      <div style="margin-top: 20px; pt: 10px; border-top: 1px solid #eee; padding-top: 15px;">
        <p style="color: #999; font-size: 12px;">
          A product by <a href="https://www.genforgestudio.com/" style="color: #f97316; font-weight: bold; text-decoration: underline;">GenForge Studio</a>
        </p>
      </div>
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

export const sendOTPEmail = async (userEmail: string, otp: string, type: 'signup' | 'reset') => {
  const fromName = process.env.SMTP_FROM_NAME || 'ZeeOffer';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const title = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
  const action = type === 'signup' ? 'completing your registration' : 'resetting your password';

  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 40px; text-align: center; color: #333;">
      <h2 style="color: #f97316; margin-bottom: 20px;">${title}</h2>
      <p style="font-size: 16px; margin-bottom: 30px;">
        Use the code below for ${action}. This code will expire in 10 minutes.
      </p>
      <div style="background: #f4f4f4; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin-bottom: 30px;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #999;">
        If you didn't request this, please ignore this email.
      </p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-weight: bold; color: #333;">${fromName} Team</p>
      <div style="margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px;">
        <p style="color: #999; font-size: 11px;">
          A product by <a href="https://www.genforgestudio.com/" style="color: #f97316; font-weight: bold; text-decoration: underline;">GenForge Studio</a>
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: userEmail,
      subject: `${otp} is your ${type} code`,
      html,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const sendSubscriptionActivationEmail = async (userEmail: string, planName: string, expiryDate: Date) => {
  const fromName = process.env.SMTP_FROM_NAME || 'ZeeOffer';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const formattedExpiry = expiryDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: white;">
      <div style="background: #10b981; padding: 40px; text-align: center; color: white;">
        <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Subscription Activated!</h1>
        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Welcome to the premium experience</p>
      </div>
      <div style="padding: 40px; color: #333; line-height: 1.6;">
        <p style="font-size: 18px; margin-top: 0;">Hi there,</p>
        <p>Great news! Your payment was successful and your <b>${planName.toUpperCase()}</b> plan is now active.</p>
        
        <div style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
          <p style="margin: 0; font-size: 14px; text-transform: uppercase; color: #6b7280; font-weight: 600; letter-spacing: 0.05em;">Valid Until</p>
          <p style="margin: 5px 0 0; font-size: 24px; font-weight: 700; color: #111827;">${formattedExpiry}</p>
        </div>

        <p>You now have full access to all ZeeOffer features, including unlimited form creation, partner management, and real-time lead tracking.</p>
        
        <div style="margin-top: 35px; text-align: center;">
          <a href="${(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')}/admin/dashboard" style="background: #10b981; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">Go to Dashboard</a>
        </div>
      </div>
      <div style="background: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #eee;">
        <p style="color: #6b7280; font-size: 12px; margin: 0;">If you have any questions, simply reply to this email.</p>
        <div style="margin-top: 15px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            A product by <a href="https://www.genforgestudio.com/" style="color: #f97316; font-weight: bold; text-decoration: underline;">GenForge Studio</a>
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0;">© 2026 ${fromName}. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: userEmail,
      subject: `✨ Plan Activated: ${planName.toUpperCase()} Plan`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
};
