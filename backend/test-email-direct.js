// Simple test for email functionality
import { Resend } from 'resend';
import env from './config/env.js';
import { getRefundApprovalTemplate } from './util/emailTemplates.js';

const testEmail = async () => {
  try {
    console.log('Testing Resend email functionality...');
    console.log('NODE_ENV:', env.NODE_ENV);
    console.log('RESEND_API_KEY exists:', !!env.RESEND_API_KEY);
    console.log('EMAIL_SENDER:', env.EMAIL_SENDER);

    const resend = new Resend(env.RESEND_API_KEY);

    const template = getRefundApprovalTemplate({
      userName: 'Test User',
      requestId: 'TEST-123',
      requestedAmount: 1500,
      currency: 'LKR',
      originalPaymentId: 'TEST-PAYMENT-456',
      paymentType: 'membership',
      approvedDate: 'October 3, 2025',
      adminNotes: 'Test email'
    });

    console.log('Template subject:', template.subject);

    const fromEmail = env.NODE_ENV === "development" ? "onboarding@resend.dev" : env.EMAIL_SENDER;
    const toEmail = env.NODE_ENV === "development" ? "delivered@resend.dev" : "test@example.com";

    console.log('From:', fromEmail);
    console.log('To:', toEmail);

    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', result.data?.id);
    console.log('Full result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Email test failed:', error);
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testEmail();