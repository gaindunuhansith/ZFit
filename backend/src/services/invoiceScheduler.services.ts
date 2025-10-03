import Invoice from '../models/invoice.model.js';
import { sendInvoiceOverdueSMS } from '../util/sendSMS.util.js';

/**
 * Check for overdue invoices and update their status
 * This function should be called periodically (e.g., daily)
 */
export const checkAndUpdateOverdueInvoices = async (): Promise<void> => {
    try {
        const currentDate = new Date();

        // Find all invoices that are 'sent' or 'paid' but past their due date
        const overdueInvoices = await Invoice.find({
            status: { $in: ['sent', 'paid'] },
            dueDate: { $lt: currentDate }
        }).populate('userId', 'name email contactNo');

        console.log(`Found ${overdueInvoices.length} potentially overdue invoices`);

        for (const invoice of overdueInvoices) {
            try {
                // Update status to overdue
                await Invoice.findByIdAndUpdate(invoice._id, {
                    status: 'overdue',
                    updatedAt: new Date()
                });

                console.log(`Invoice ${invoice.number} marked as overdue`);

                // Send SMS notification to user
                const user = invoice.userId as any;
                if (user && user.contactNo) {
                    try {
                        await sendInvoiceOverdueSMS(
                            user.contactNo,
                            user.name,
                            invoice.number,
                            invoice.total
                        );
                        console.log(`Overdue SMS sent to ${user.contactNo} for invoice ${invoice.number}`);
                    } catch (smsError) {
                        console.error(`Failed to send overdue SMS for invoice ${invoice.number}:`, smsError);
                    }
                } else {
                    console.log(`No phone number found for user, skipping SMS for invoice ${invoice.number}`);
                }
            } catch (updateError) {
                console.error(`Failed to update invoice ${invoice._id}:`, updateError);
            }
        }
    } catch (error) {
        console.error('Error checking for overdue invoices:', error);
    }
};

/**
 * Get invoice statistics for dashboard
 */
export const getInvoiceStatistics = async () => {
    try {
        const stats = await Invoice.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$total' }
                }
            }
        ]);

        const result = {
            total: 0,
            draft: 0,
            sent: 0,
            paid: 0,
            overdue: 0,
            totalRevenue: 0,
            pendingRevenue: 0,
            overdueRevenue: 0
        };

        stats.forEach((stat: any) => {
            (result as any)[stat._id] = stat.count;
            result.total += stat.count;

            if (stat._id === 'paid') {
                result.totalRevenue = stat.totalAmount;
            } else if (stat._id === 'sent') {
                result.pendingRevenue = stat.totalAmount;
            } else if (stat._id === 'overdue') {
                result.overdueRevenue = stat.totalAmount;
            }
        });

        return result;
    } catch (error) {
        console.error('Error getting invoice statistics:', error);
        throw error;
    }
};

/**
 * Send payment reminders for invoices due soon (within 3 days)
 */
export const sendPaymentReminders = async (): Promise<void> => {
    try {
        const currentDate = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(currentDate.getDate() + 3);

        // Find invoices due within 3 days that are still sent (not paid or overdue)
        const dueSoonInvoices = await Invoice.find({
            status: 'sent',
            dueDate: {
                $gte: currentDate,
                $lte: threeDaysFromNow
            }
        }).populate('userId', 'name email contactNo');

        console.log(`Found ${dueSoonInvoices.length} invoices due within 3 days`);

        for (const invoice of dueSoonInvoices) {
            try {
                const user = invoice.userId as any;
                const daysLeft = Math.ceil((invoice.dueDate!.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

                if (user && user.contactNo) {
                    // Import the payment reminder SMS function
                    const { sendPaymentReminderSMS } = await import('../util/sendSMS.util.js');

                    await sendPaymentReminderSMS(
                        user.contactNo,
                        user.name,
                        invoice.total,
                        invoice.dueDate!.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                    );
                    console.log(`Payment reminder SMS sent to ${user.contactNo} for invoice ${invoice.number} (${daysLeft} days left)`);
                }
            } catch (smsError) {
                console.error(`Failed to send payment reminder SMS for invoice ${invoice.number}:`, smsError);
            }
        }
    } catch (error) {
        console.error('Error sending payment reminders:', error);
    }
};