export function getVerificationEmailTemplate(
  verifyUrl: string,
  username?: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0e1117;
      color: #e6edf3;
    }
    .container {
      max-width: 580px;
      margin: 40px auto;
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }
    .header {
      padding: 32px 32px 24px;
      text-align: center;
      border-bottom: 1px solid #21262d;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #58a6ff;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 32px;
      line-height: 1.6;
    }
    h1 {
      margin-top: 0;
      font-size: 20px;
      color: #f0f6fc;
    }
    p {
      color: #8b949e;
      font-size: 15px;
      margin-bottom: 24px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background-color: #238636;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      transition: background-color 0.2s ease;
    }
    .footer {
      padding: 24px 32px;
      background: #0d1117;
      border-top: 1px solid #21262d;
      font-size: 12px;
      color: #6e7681;
      text-align: center;
    }
    .alt-link {
      word-break: break-all;
      color: #58a6ff;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">⚡ Cloud IDE</div>
    </div>
    <div class="content">
      <h1>Welcome ${username ? `, ${username}` : ''}!</h1>
      <p>Thank you for signing up. Please verify your email address to activate your account and start coding.</p>
      
      <div class="button-container">
        <a href="${verifyUrl}" class="button" target="_blank">Verify Email Address</a>
      </div>

      <p style="font-size: 13px;">This verification link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
      
      <p style="font-size: 12px; margin-bottom: 8px;">If the button above does not work, copy and paste this link into your browser:</p>
      <a href="${verifyUrl}" class="alt-link">${verifyUrl}</a>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Cloud IDE Platform. All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();
}
