// src/utils/mailer.ts
import nodemailer from "nodemailer";

/**
 * Sends a real password-reset email to `toEmail`.
 *
 * Required .env variables:
 *   SMTP_HOST      e.g. smtp.gmail.com
 *   SMTP_PORT      e.g. 587
 *   SMTP_USER      your-email@gmail.com
 *   SMTP_PASS      your Gmail App Password  (NOT your real password)
 *   EMAIL_FROM     (optional) defaults to SMTP_USER
 *   CLIENT_URL     (optional) defaults to http://localhost:5173
 *
 * Gmail quick-start:
 *   1. Enable 2-Step Verification on your Google account
 *   2. Go to Google Account → Security → App Passwords
 *   3. Create an app password and paste it as SMTP_PASS
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetToken: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const clientUrl = process.env.CLIENT_URL;
  // This link opens your frontend ResetPasswordPage with the token in the URL
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"CRM Lite" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Reset your CRM Lite password",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:48px 0;">
    <tr>
      <td align="center">

        <table width="540" cellpadding="0" cellspacing="0"
          style="background:#181b24;border-radius:20px;
                 border:1px solid rgba(255,255,255,0.07);overflow:hidden;
                 box-shadow:0 32px 80px rgba(0,0,0,0.5);">

          <!-- gradient top bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#a8b117 0%,#0d6d40 100%);height:5px;"></td>
          </tr>

          <!-- body -->
          <tr>
            <td style="padding:44px 52px 40px;">

              <!-- brand -->
              <p style="margin:0 0 4px;font-size:10px;font-weight:800;letter-spacing:4px;
                        text-transform:uppercase;color:rgba(255,255,255,0.28);">CRM Lite</p>

              <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;
                         color:#ffffff;line-height:1.2;">Password Reset</h1>

              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;
                        color:rgba(255,255,255,0.55);">
                Hi <strong style="color:rgba(255,255,255,0.8);">${toName}</strong>, we received
                a request to reset the password for your account
                (<strong style="color:rgba(255,255,255,0.8);">${toEmail}</strong>).
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center"
                    style="background:linear-gradient(90deg,#a8b117 0%,#0d6d40 100%);
                           border-radius:14px;">
                    <a href="${resetLink}"
                       style="display:inline-block;padding:15px 42px;
                              font-size:16px;font-weight:700;
                              color:#ffffff;text-decoration:none;
                              letter-spacing:0.2px;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- expiry warning -->
              <table cellpadding="0" cellspacing="0"
                style="margin:28px 0 0;background:rgba(255,200,80,0.07);
                       border:1px solid rgba(255,200,80,0.15);
                       border-radius:12px;width:100%;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;
                              color:rgba(255,200,80,0.9);">
                      ⏱&nbsp; This link expires in 10 minutes
                    </p>
                    <p style="margin:0;font-size:13px;line-height:1.6;
                              color:rgba(255,255,255,0.38);">
                      After 10 minutes the link will stop working and you will need
                      to request a new one. If you did not request a reset, you can
                      safely ignore this email — your password will not change.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- fallback URL -->
              <p style="margin:28px 0 0;font-size:12px;color:rgba(255,255,255,0.25);
                        line-height:1.7;">
                Button not working? Copy and paste this URL into your browser:<br/>
                <a href="${resetLink}"
                   style="color:rgba(168,177,23,0.7);word-break:break-all;">
                  ${resetLink}
                </a>
              </p>

            </td>
          </tr>

          <!-- gradient bottom bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#a8b117 0%,#0d6d40 100%);height:5px;"></td>
          </tr>

        </table>

        <p style="margin:20px 0 0;font-size:11px;color:rgba(255,255,255,0.18);">
          © ${new Date().getFullYear()} CRM Lite — All rights reserved
        </p>

      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
}
