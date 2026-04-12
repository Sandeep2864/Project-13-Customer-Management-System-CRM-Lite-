import nodemailer from "nodemailer";

/**
 * Sends a real password-reset email to `toEmail`.
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetToken: string,
): Promise<void> {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },

    // 🔥 FORCE IPv4 (VERY IMPORTANT FIX FOR RENDER)
    family: 4
  });

  const clientUrl = process.env.CLIENT_URL;
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

          <tr>
            <td style="background:linear-gradient(90deg,#a8b117 0%,#0d6d40 100%);height:5px;"></td>
          </tr>

          <tr>
            <td style="padding:44px 52px 40px;">

              <p style="margin:0 0 4px;font-size:10px;font-weight:800;letter-spacing:4px;
                        text-transform:uppercase;color:rgba(255,255,255,0.28);">CRM Lite</p>

              <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#ffffff;">
                Password Reset
              </h1>

              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.55);">
                Hi <strong>${toName}</strong>, we received a request to reset your password
                (<strong>${toEmail}</strong>).
              </p>

              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(90deg,#a8b117 0%,#0d6d40 100%);
                             border-radius:14px;">
                    <a href="${resetLink}"
                       style="display:inline-block;padding:15px 42px;
                              font-size:16px;font-weight:700;color:#fff;text-decoration:none;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:12px;color:rgba(255,255,255,0.25);">
                ${resetLink}
              </p>

            </td>
          </tr>

          <tr>
            <td style="background:linear-gradient(90deg,#a8b117 0%,#0d6d40 100%);height:5px;"></td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
}
