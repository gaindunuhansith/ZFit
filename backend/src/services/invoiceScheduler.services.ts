import Invoice from '../models/invoice.model.js';

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