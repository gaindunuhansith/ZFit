import { checkAndUpdateOverdueInvoices } from '../services/invoiceScheduler.services.js';

/**
 * Invoice automation scheduler
 * Runs periodic tasks for invoice management
 */
class InvoiceScheduler {
    private overdueCheckInterval: NodeJS.Timeout | null = null;

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

        // Run initial checks on startup
        setTimeout(async () => {
            console.log('Running initial overdue invoice check...');
            await checkAndUpdateOverdueInvoices();
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
    }

    /**
     * Manually trigger overdue check (for testing)
     */
    async triggerOverdueCheck(): Promise<void> {
        console.log('Manually triggering overdue invoice check...');
        await checkAndUpdateOverdueInvoices();
    }
}

// Export singleton instance
export const invoiceScheduler = new InvoiceScheduler();