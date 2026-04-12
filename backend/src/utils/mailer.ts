import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetToken: string,
): Promise<void> {

  // ✅ FIX: use "as any" to bypass strict TypeScript Nodemailer errors on Render
  const transporter = nodemailer.createTransport(
    {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail App Password
      },

      family: 4, // 🔥 FORCE IPv4 (fix ENETUNREACH error)
    } as any
  );

  const clientUrl = process.env.CLIENT_URL;
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"CRM Lite" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Reset your CRM Lite password",

    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Password Reset</title>
</head>
<body style="font-family:Arial,sans-serif;background:#0f1117;color:#fff;padding:20px;">

  <div style="max-width:600px;margin:auto;background:#181b24;padding:30px;border-radius:12px;">

    <h2>Password Reset Request</h2>

    <p>Hi <strong>${toName}</strong>,</p>

    <p>We received a request to reset your password for:</p>

    <p><strong>${toEmail}</strong></p>

    <a href="${resetLink}"
       style="display:inline-block;margin-top:20px;padding:12px 24px;
              background:#0d6d40;color:#fff;text-decoration:none;border-radius:8px;">
      Reset Password
    </a>

    <p style="margin-top:20px;font-size:12px;color:#aaa;">
      This link will expire in 10 minutes.
    </p>

    <p style="word-break:break-all;font-size:12px;color:#777;">
      ${resetLink}
    </p>

  </div>

</body>
</html>
    `,
  });
}
