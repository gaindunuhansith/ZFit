import { checkAndUpdateOverdueInvoices, cleanupOldPendingPayments } from '../services/invoiceScheduler.services.js';

/**
 * Invoice automation scheduler
 * Runs periodic tasks for invoice management
 */
class InvoiceScheduler {
    private overdueCheckInterval: NodeJS.Timeout | null = null;
    private paymentCleanupInterval: NodeJS.Timeout | null = null;

    /**
     * Start the invoice scheduler
     */
    start(): void {
        console.log('Starting invoice automation scheduler...');

        // Check for overdue invoices daily (every 24 hours)
        this.overdueCheckInterval = setInterval(async () => {
            console.log('Running overdue invoice check...');
            await checkAndUpdateOverdueInvoices();
        }, 24 * 60 * 60 * 1000); // 24 hours

        // Cleanup old pending payments weekly (every 7 days)
        this.paymentCleanupInterval = setInterval(async () => {
            console.log('Running pending payment cleanup...');
            await cleanupOldPendingPayments(30); // 30 days old
        }, 7 * 24 * 60 * 60 * 1000); // 7 days

        // Run initial checks on startup
        setTimeout(async () => {
            console.log('Running initial overdue invoice check...');
            await checkAndUpdateOverdueInvoices();

            console.log('Running initial pending payment cleanup...');
            await cleanupOldPendingPayments(30);
        }, 5000); // Wait 5 seconds after startup
    }

    /**
     * Stop the invoice scheduler
     */
    stop(): void {
        console.log('Stopping invoice automation scheduler...');

        if (this.overdueCheckInterval) {
            clearInterval(this.overdueCheckInterval);
            this.overdueCheckInterval = null;
        }

        if (this.paymentCleanupInterval) {
            clearInterval(this.paymentCleanupInterval);
            this.paymentCleanupInterval = null;
        }
    }

    /**
     * Manually trigger overdue check (for testing)
     */
    async triggerOverdueCheck(): Promise<void> {
        console.log('Manually triggering overdue invoice check...');
        await checkAndUpdateOverdueInvoices();
    }

    /**
     * Manually trigger payment cleanup (for testing)
     */
    async triggerPaymentCleanup(daysOld: number = 30): Promise<void> {
        console.log(`Manually triggering payment cleanup for payments older than ${daysOld} days...`);
        await cleanupOldPendingPayments(daysOld);
    }
}

// Export singleton instance
export const invoiceScheduler = new InvoiceScheduler();