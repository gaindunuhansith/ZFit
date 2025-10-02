export const getPasswordResetTemplate = (url: string) => ({
  subject: "Password Reset Request",
  text: `You requested a password reset. Click on the link to reset your password: ${url}`,
  html: `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><title>Reset Password Email Template</title><meta name="description" content="Reset Password Email Template."><style type="text/css">a:hover{text-decoration:underline!important}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><!--100%body table--><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td style="text-align:center;"></a></td></tr><tr><td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have requested to reset your password</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p><a target="_blank" href="${url}" style="background:#2f89ff;text-decoration:none !important; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="text-align:center;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy;</p></td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table><!--/100%body table--></body></html>`,
});

export const getVerifyEmailTemplate = (url: string) => ({
  subject: "Verify Email Address",
  text: `Click on the link to verify your email address: ${url}`,
  html: `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><title>Verify Email Address Email Template</title><meta name="description" content="Verify Email Address Email Template."><style type="text/css">a:hover{text-decoration:underline!important}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><!--100%body table--><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td style="text-align:center;"></a></td></tr><tr><td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Please verify your email address</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Click on the following link to verify your email address.</p><a target="_blank" href="${url}" style="background:#2f89ff;text-decoration:none !important; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email Address</a></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="text-align:center;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy;</p></td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table><!--/100%body table--></body></html>`,
});

export const getWelcomeEmailTemplate = (resetPasswordUrl: string, userName: string) => ({
  subject: "Welcome to ZFit - Your Fitness Journey Begins!",
  text: `Welcome to ZFit, ${userName}! Your account has been created successfully. To get started, please set your password by clicking this link: ${resetPasswordUrl}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ZFit</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
      color: #ffffff;
    }
    .container {
      max-width: 650px;
      margin: 0 auto;
      background: linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .email-body {
      padding: 30px;
    }
    .header-section {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #404040;
      position: relative;
    }
    .header-section::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, #AAFF69 0%, #7BC96F 100%);
    }
    .logo-area {
      font-size: 32px;
      font-weight: 800;
      color: #AAFF69;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(170, 255, 105, 0.3);
      letter-spacing: 2px;
    }
    .welcome-icon {
      font-size: 48px;
      margin: 15px 0;
      color: #AAFF69;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    .main-title {
      font-size: 28px;
      font-weight: 700;
      margin: 12px 0;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .greeting {
      font-size: 20px;
      color: #cccccc;
      margin: 20px 0 12px 0;
      font-weight: 400;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #e0e0e0;
      margin: 12px 0;
      font-weight: 400;
    }
    .highlight-box {
      background: linear-gradient(145deg, #AAFF69 0%, #7BC96F 100%);
      color: #000;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(170, 255, 105, 0.2);
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      padding: 16px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      margin: 20px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #AAFF69 0%, #7BC96F 100%);
      color: #000;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      position: relative;
      overflow: hidden;
    }
    .cta-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    .cta-button:hover::before {
      left: 100%;
    }
    .features-list {
      background: linear-gradient(145deg, #1a1a1a 0%, #252525 100%);
      border: 1px solid #404040;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .features-list h3 {
      color: #AAFF69;
      margin-top: 0;
      font-size: 18px;
    }
    .features-list ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .features-list li {
      padding: 8px 0;
      border-bottom: 1px solid #333;
      color: #e0e0e0;
    }
    .features-list li:last-child {
      border-bottom: none;
    }
    .features-list li:before {
      content: "✓";
      color: #AAFF69;
      font-weight: bold;
      margin-right: 10px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background: linear-gradient(145deg, #1a1a1a 0%, #252525 100%);
      border-top: 1px solid #404040;
      font-size: 13px;
      color: #888;
    }
    .footer a {
      color: #AAFF69;
      text-decoration: none;
      font-weight: 500;
    }
    .footer a:hover {
      color: #7BC96F;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-body">
      <div class="header-section">
        <div class="logo-area">ZFit</div>
        <div class="welcome-icon">🎉</div>
        <div class="main-title">Welcome Aboard!</div>
      </div>

      <div class="greeting">Dear <strong style="color: #AAFF69;">${userName}</strong>,</div>

      <div class="message">
        Welcome to ZFit! We're thrilled to have you join our fitness community. Your account has been successfully created and you're now ready to start your fitness journey with us.
      </div>

      <div class="highlight-box">
        🚀 Your fitness transformation starts now! Get ready to achieve your goals with our state-of-the-art facilities and expert guidance.
      </div>

      <div class="message">
        To complete your account setup and ensure security, please set your password by clicking the button below:
      </div>

      <div style="text-align: center;">
        <a href="${resetPasswordUrl}" class="cta-button">Set Your Password</a>
      </div>

      <div class="features-list">
        <h3>What you can do with ZFit:</h3>
        <ul>
          <li>Book fitness classes and personal training sessions</li>
          <li>Track your progress and achievements</li>
          <li>Access our premium gym facilities 24/7</li>
          <li>Connect with trainers and fellow members</li>
          <li>Manage your membership and payments</li>
        </ul>
      </div>

      <div class="message" style="text-align: center; margin-top: 20px;">
        Questions? Our support team is here to help at <a href="mailto:support@zfit.com" style="color: #AAFF69; font-weight: 600;">support@zfit.com</a>
      </div>
    </div>

    <div class="footer">
      <div style="margin-bottom: 10px; font-weight: 600;">&copy; ${new Date().getFullYear()} ZFit Gym Management System</div>
      <div>
        <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a> • <a href="#">Unsubscribe</a>
      </div>
      <div style="margin-top: 10px; font-size: 11px; color: #666;">
        123 Fitness Street, Colombo, Sri Lanka
      </div>
    </div>
  </div>
</body>
</html>`,
});

export interface BankTransferApprovalData {
  userName: string;
  membershipName: string;
  amount: number;
  currency: string;
  transactionId: string;
  approvedDate: string;
  adminNotes?: string | undefined;
}

export const getBankTransferApprovalTemplate = (data: BankTransferApprovalData) => ({
  subject: "Bank Transfer Payment Approved - ZFit Gym",
  text: `Hi ${data.userName}, your bank transfer payment for ${data.membershipName} (${data.currency} ${data.amount}) has been approved. Transaction ID: ${data.transactionId}. Your membership has been activated.`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bank Transfer Approved - ZFit Gym</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: #ffffff;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
          background: linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%);
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .email-body {
          padding: 30px;
        }
        .header-section {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #404040;
          position: relative;
        }
        .header-section::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #AAFF69 0%, #7BC96F 100%);
        }
        .logo-area {
          font-size: 28px;
          font-weight: 800;
          color: #AAFF69;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(170, 255, 105, 0.3);
          letter-spacing: 2px;
        }
        .status-icon {
          font-size: 48px;
          margin: 15px 0;
          color: #10b981;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .main-title {
          font-size: 26px;
          font-weight: 700;
          margin: 12px 0;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .greeting {
          font-size: 18px;
          color: #cccccc;
          margin: 20px 0 12px 0;
          font-weight: 400;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          color: #e0e0e0;
          margin: 12px 0;
          font-weight: 400;
        }
        .amount-box {
          background: linear-gradient(135deg, #AAFF69 0%, #7BC96F 100%);
          color: #000;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(170, 255, 105, 0.2);
          position: relative;
          overflow: hidden;
        }
        .amount-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .amount-label {
          font-size: 16px;
          margin-bottom: 8px;
          opacity: 0.9;
        }
        .amount-value {
          font-size: 24px;
          margin-top: 8px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%);
          border: 1px solid #404040;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .details-table tr:nth-child(even) {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
        }
        .details-table tr:nth-child(odd) {
          background: linear-gradient(145deg, #252525 0%, #2a2a2a 100%);
        }
        .details-table td {
          padding: 15px 20px;
          border-bottom: 1px solid #333;
          font-size: 15px;
        }
        .details-table .label {
          color: #aaaaaa;
          font-weight: 600;
          width: 35%;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .details-table .value {
          color: #ffffff;
          font-weight: 500;
        }
        .cta-button {
          display: inline-block;
          padding: 16px 32px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 16px;
          text-align: center;
          margin: 20px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #AAFF69 0%, #7BC96F 100%);
          color: #000;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }
        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .cta-button:hover::before {
          left: 100%;
        }
        .highlight-box {
          background: linear-gradient(145deg, #333 0%, #404040 100%);
          border-left: 4px solid #AAFF69;
          padding: 16px 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .highlight-box strong {
          color: #AAFF69;
          font-weight: 700;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background: linear-gradient(145deg, #1a1a1a 0%, #252525 100%);
          border-top: 1px solid #404040;
          font-size: 13px;
          color: #888;
        }
        .footer a {
          color: #AAFF69;
          text-decoration: none;
          font-weight: 500;
        }
        .footer a:hover {
          color: #7BC96F;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-body">
          <div class="header-section">
            <div class="logo-area">ZFit</div>
            <div class="status-icon">✓</div>
            <div class="main-title">Payment Approved</div>
          </div>

          <div class="greeting">Dear <strong style="color: #AAFF69;">${data.userName}</strong>,</div>

          <div class="message">
            Your bank transfer payment has been successfully verified and approved. Your membership is now active and ready for use.
          </div>

          <div class="amount-box">
            <div class="amount-label">${data.membershipName}</div>
            <div class="amount-value">${data.currency} ${data.amount.toLocaleString()}</div>
          </div>

          <table class="details-table">
            <tr>
              <td class="label">Transaction ID</td>
              <td class="value">${data.transactionId}</td>
            </tr>
            <tr>
              <td class="label">Approval Date</td>
              <td class="value">${data.approvedDate}</td>
            </tr>
            ${data.adminNotes ? `
            <tr>
              <td class="label">Admin Notes</td>
              <td class="value">${data.adminNotes}</td>
            </tr>
            ` : ''}
          </table>

          <div class="highlight-box">
            <strong>Next Steps:</strong> You can now access all gym facilities and start your fitness journey. Visit your dashboard to explore available classes and amenities.
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/memberDashboard/memberships/my-memberships" class="cta-button">Access My Dashboard</a>
          </div>

          <div class="message" style="text-align: center; margin-top: 20px;">
            Questions? Our support team is here to help at <a href="mailto:support@zfit.com" style="color: #AAFF69; font-weight: 600;">support@zfit.com</a>
          </div>
        </div>

        <div class="footer">
          <div style="margin-bottom: 10px; font-weight: 600;">&copy; ${new Date().getFullYear()} ZFit Gym Management System</div>
          <div>
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a> • <a href="#">Unsubscribe</a>
          </div>
          <div style="margin-top: 10px; font-size: 11px; color: #666;">
            123 Fitness Street, Colombo, Sri Lanka
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const getBankTransferDeclineTemplate = (data: BankTransferApprovalData) => ({
  subject: "Bank Transfer Payment Declined - ZFit Gym",
  text: `Hi ${data.userName}, unfortunately your bank transfer payment for ${data.membershipName} (${data.currency} ${data.amount}) has been declined. ${data.adminNotes ? 'Reason: ' + data.adminNotes : ''} Please contact support for assistance.`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bank Transfer Declined - ZFit Gym</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: #ffffff;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
          background: linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%);
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .email-body {
          padding: 30px;
        }
        .header-section {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #404040;
          position: relative;
        }
        .header-section::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #AAFF69 0%, #7BC96F 100%);
        }
        .logo-area {
          font-size: 28px;
          font-weight: 800;
          color: #AAFF69;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(170, 255, 105, 0.3);
          letter-spacing: 2px;
        }
        .status-icon {
          font-size: 48px;
          margin: 15px 0;
          color: #ef4444;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .main-title {
          font-size: 26px;
          font-weight: 700;
          margin: 12px 0;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .greeting {
          font-size: 18px;
          color: #cccccc;
          margin: 20px 0 12px 0;
          font-weight: 400;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          color: #e0e0e0;
          margin: 12px 0;
          font-weight: 400;
        }
        .amount-box {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
          position: relative;
          overflow: hidden;
        }
        .amount-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .amount-label {
          font-size: 16px;
          margin-bottom: 8px;
          opacity: 0.9;
        }
        .amount-value {
          font-size: 24px;
          margin-top: 8px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%);
          border: 1px solid #404040;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .details-table tr:nth-child(even) {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
        }
        .details-table tr:nth-child(odd) {
          background: linear-gradient(145deg, #252525 0%, #2a2a2a 100%);
        }
        .details-table td {
          padding: 15px 20px;
          border-bottom: 1px solid #333;
          font-size: 15px;
        }
        .details-table .label {
          color: #aaaaaa;
          font-weight: 600;
          width: 35%;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .details-table .value {
          color: #ffffff;
          font-weight: 500;
        }
        .cta-button {
          display: inline-block;
          padding: 16px 32px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          font-size: 16px;
          text-align: center;
          margin: 20px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }
        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .cta-button:hover::before {
          left: 100%;
        }
        .highlight-box {
          background: linear-gradient(145deg, #333 0%, #404040 100%);
          border-left: 4px solid #ef4444;
          padding: 16px 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .highlight-box strong {
          color: #ef4444;
          font-weight: 700;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background: linear-gradient(145deg, #1a1a1a 0%, #252525 100%);
          border-top: 1px solid #404040;
          font-size: 13px;
          color: #888;
        }
        .footer a {
          color: #AAFF69;
          text-decoration: none;
          font-weight: 500;
        }
        .footer a:hover {
          color: #7BC96F;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-body">
          <div class="header-section">
            <div class="logo-area">ZFit</div>
            <div class="status-icon">✗</div>
            <div class="main-title">Payment Declined</div>
          </div>

          <div class="greeting">Dear <strong style="color: #AAFF69;">${data.userName}</strong>,</div>

          <div class="message">
            We were unable to approve your bank transfer payment after careful review. Please see the details below for further information.
          </div>

          <div class="amount-box">
            <div class="amount-label">${data.membershipName}</div>
            <div class="amount-value">${data.currency} ${data.amount.toLocaleString()}</div>
          </div>

          <table class="details-table">
            <tr>
              <td class="label">Transaction ID</td>
              <td class="value">${data.transactionId}</td>
            </tr>
            <tr>
              <td class="label">Declined Date</td>
              <td class="value">${data.approvedDate}</td>
            </tr>
            ${data.adminNotes ? `
            <tr>
              <td class="label">Reason</td>
              <td class="value" style="color: #ef4444; font-weight: 600;">${data.adminNotes}</td>
            </tr>
            ` : ''}
          </table>

          <div class="highlight-box">
            <strong>What to do next:</strong> Submit a new payment with a high-quality receipt image, or contact our support team for assistance with your membership registration.
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/memberDashboard/memberships/browse" class="cta-button">Submit New Payment</a>
          </div>

          <div class="message" style="text-align: center; margin-top: 20px;">
            Need assistance? Contact our team at <a href="mailto:support@zfit.com" style="color: #AAFF69; font-weight: 600;">support@zfit.com</a>
          </div>
        </div>

        <div class="footer">
          <div style="margin-bottom: 10px; font-weight: 600;">&copy; ${new Date().getFullYear()} ZFit Gym Management System</div>
          <div>
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a> • <a href="#">Unsubscribe</a>
          </div>
          <div style="margin-top: 10px; font-size: 11px; color: #666;">
            123 Fitness Street, Colombo, Sri Lanka
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
});