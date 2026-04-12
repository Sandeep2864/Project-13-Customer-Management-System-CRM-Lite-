import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Sends password reset email
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetToken: string,
): Promise<void> {

  // ✅ FIXED: Proper TS typing + IPv4 forced
  const transporter = nodemailer.createTransport({
    service: "gmail", // 🔥 avoids host/port TS issue

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },

    family: 4, // 🔥 FORCE IPv4 (fixes ENETUNREACH issue)
  } as SMTPTransport.Options);

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
                 border:1px solid rgba(255,255,255,0.07);
                 box-shadow:0 32px 80px rgba(0,0,0,0.5);">

          <tr>
            <td style="background:linear-gradient(90deg,#a8b117 0%,#0d6d40 100%);height:5px;"></td>
          </tr>

          <tr>
            <td style="padding:44px 52px;">

              <p style="margin:0;font-size:10px;font-weight:800;letter-spacing:4px;
                        text-transform:uppercase;color:rgba(255,255,255,0.28);">
                CRM Lite
              </p>

              <h1 style="margin:8px 0 16px;font-size:28px;font-weight:700;color:#fff;">
                Password Reset
              </h1>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.6);">
                Hi <strong style="color:#fff;">${toName}</strong>, we received a request
                to reset your password for <strong>${toEmail}</strong>.
              </p>

              <table>
                <tr>
                  <td style="background:linear-gradient(90deg,#a8b117,#0d6d40);
                             border-radius:12px;">
                    <a href="${resetLink}"
                       style="display:inline-block;padding:14px 36px;
                              color:#fff;text-decoration:none;font-weight:700;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin-top:24px;font-size:12px;color:rgba(255,255,255,0.3);">
                This link will expire in 10 minutes.
              </p>

              <p style="margin-top:12px;font-size:12px;color:rgba(255,255,255,0.3);word-break:break-all;">
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
