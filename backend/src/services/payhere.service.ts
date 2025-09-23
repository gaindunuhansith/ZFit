import axios from 'axios';
import crypto from 'crypto';
import payHereConfig from '../config/payhere.js';

export class PayHereService {

  // Generate payment hash for security
  private generateHash(orderId: string, amount: number, currency: string): string {
    const hashString = payHereConfig.merchantId + orderId + amount + currency +
                      crypto.createHash('md5').update(payHereConfig.merchantSecret).digest('hex');
    return crypto.createHash('md5').update(hashString).digest('hex');
  }

  // Process one-time payment (for initial setup or manual payments)
  async processPayment(paymentData: {
    orderId: string;
    amount: number;
    currency: string;
    items: string;
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  }) {
    const data = {
      merchant_id: payHereConfig.merchantId,
      return_url: payHereConfig.returnUrl,
      cancel_url: payHereConfig.cancelUrl,
      notify_url: payHereConfig.notifyUrl,
      order_id: paymentData.orderId,
      items: paymentData.items,
      amount: paymentData.amount,
      currency: paymentData.currency,
      first_name: paymentData.customer.firstName,
      last_name: paymentData.customer.lastName || '',
      email: paymentData.customer.email,
      phone: paymentData.customer.phone || '',
      address: '',
      city: '',
      country: 'Sri Lanka',
      hash: this.generateHash(paymentData.orderId, paymentData.amount, paymentData.currency)
    };

    try {
      const response = await axios.post(`${payHereConfig.baseUrl}/pay/checkout`, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`PayHere payment failed: ${error.message}`);
    }
  }

  // Process recurring payment using saved card token
  async processRecurringPayment(tokenData: {
    token: string;
    amount: number;
    currency: string;
    orderId: string;
  }) {
    const data = {
      merchant_id: payHereConfig.merchantId,
      order_id: tokenData.orderId,
      amount: tokenData.amount,
      currency: tokenData.currency,
      token: tokenData.token,
      hash: this.generateHash(tokenData.orderId, tokenData.amount, tokenData.currency)
    };

    try {
      const response = await axios.post(`${payHereConfig.baseUrl}/pay/recurring`, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`PayHere recurring payment failed: ${error.message}`);
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(data: any, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', payHereConfig.merchantSecret)
      .update(JSON.stringify(data))
      .digest('hex');

    return signature === expectedSignature;
  }
}

export default new PayHereService();