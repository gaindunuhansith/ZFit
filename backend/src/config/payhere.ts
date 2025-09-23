interface PayHereConfig {
  merchantId: string;
  merchantSecret: string;
  baseUrl: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  environment: 'sandbox' | 'production';
}

const payHereConfig: PayHereConfig = {
  merchantId: process.env.PAYHERE_MERCHANT_ID || 'PAYHERE_MERCHANT_ID', 
  merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || 'PAYHERE_MERCHANT_SECRET', 
  baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.payhere.lk'
    : 'https://sandbox.payhere.lk',
  returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
  cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
  notifyUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/payments/webhook/payhere`,
  environment: (process.env.NODE_ENV as 'sandbox' | 'production') || 'sandbox'
};

export default payHereConfig;