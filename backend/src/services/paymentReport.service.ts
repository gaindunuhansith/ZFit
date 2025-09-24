import Payment from '../models/payment.model.js';
import Refund from '../models/refund.model.js';
import type { IPayment } from '../models/payment.model.js';
import mongoose from 'mongoose';

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

export interface RevenueReport {
    totalRevenue: number;
    period: string;
    paymentCount: number;
    byModule: {
        membership: number;
        inventory: number;
        booking: number;
        other: number;
    };
    byStatus: {
        completed: number;
        pending: number;
        failed: number;
        refunded: number;
    };
}

export interface PaymentTrend {
    date: string;
    amount: number;
    count: number;
    module: string;
}

/**
 * Service for generating payment reports and analytics
 */
export class PaymentReportService {
    
    /**
     * Generate revenue report for a date range
     */
    async getRevenueReport(dateRange: DateRange): Promise<RevenueReport> {
        try {
            const { startDate, endDate } = dateRange;
            
            // Aggregate payments by module and status
            const pipeline = [
                {
                    $match: {
                        date: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } },
                        paymentCount: { $sum: 1 },
                        membershipRevenue: { 
                            $sum: { 
                                $cond: [
                                    { $and: [{ $eq: ['$type', 'membership'] }, { $eq: ['$status', 'completed'] }] }, 
                                    '$amount', 
                                    0
                                ] 
                            } 
                        },
                        inventoryRevenue: { 
                            $sum: { 
                                $cond: [
                                    { $and: [{ $eq: ['$type', 'inventory'] }, { $eq: ['$status', 'completed'] }] }, 
                                    '$amount', 
                                    0
                                ] 
                            } 
                        },
                        bookingRevenue: { 
                            $sum: { 
                                $cond: [
                                    { $and: [{ $eq: ['$type', 'booking'] }, { $eq: ['$status', 'completed'] }] }, 
                                    '$amount', 
                                    0
                                ] 
                            } 
                        },
                        otherRevenue: { 
                            $sum: { 
                                $cond: [
                                    { $and: [{ $eq: ['$type', 'other'] }, { $eq: ['$status', 'completed'] }] }, 
                                    '$amount', 
                                    0
                                ] 
                            } 
                        },
                        completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                        pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                        failedCount: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
                        refundedCount: { $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] } }
                    }
                }
            ];
            
            const result = await Payment.aggregate(pipeline);
            const data = result[0] || {
                totalRevenue: 0, paymentCount: 0, membershipRevenue: 0,
                inventoryRevenue: 0, bookingRevenue: 0, otherRevenue: 0,
                completedCount: 0, pendingCount: 0, failedCount: 0, refundedCount: 0
            };
            
            return {
                totalRevenue: data.totalRevenue,
                period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
                paymentCount: data.paymentCount,
                byModule: {
                    membership: data.membershipRevenue,
                    inventory: data.inventoryRevenue,
                    booking: data.bookingRevenue,
                    other: data.otherRevenue
                },
                byStatus: {
                    completed: data.completedCount,
                    pending: data.pendingCount,
                    failed: data.failedCount,
                    refunded: data.refundedCount
                }
            };
        } catch (error) {
            throw new Error(`Failed to generate revenue report: ${(error as Error).message}`);
        }
    }

    /**
     * Get payment history with filters
     */
    async getPaymentHistory(filters: {
        userId?: string;
        type?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }) {
        try {
            const {
                userId,
                type,
                status,
                startDate,
                endDate,
                page = 1,
                limit = 50
            } = filters;

            const query: any = {};
            
            if (userId) query.userId = new mongoose.Types.ObjectId(userId);
            if (type) query.type = type;
            if (status) query.status = status;
            if (startDate || endDate) {
                query.date = {};
                if (startDate) query.date.$gte = startDate;
                if (endDate) query.date.$lte = endDate;
            }

            const skip = (page - 1) * limit;
            
            const [payments, total] = await Promise.all([
                Payment.find(query)
                    .sort({ date: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('userId', 'firstName lastName email'),
                Payment.countDocuments(query)
            ]);

            return {
                payments,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                    limit
                }
            };
        } catch (error) {
            throw new Error(`Failed to get payment history: ${(error as Error).message}`);
        }
    }

    /**
     * Get refund statistics
     */
    async getRefundStatistics(dateRange: DateRange) {
        try {
            const { startDate, endDate } = dateRange;
            
            const pipeline = [
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRefunds: { $sum: '$refundAmount' },
                        refundCount: { $sum: 1 },
                        avgRefundAmount: { $avg: '$refundAmount' },
                        byReason: {
                            $push: {
                                reason: '$reason',
                                amount: '$refundAmount'
                            }
                        },
                        byStatus: {
                            $push: {
                                status: '$status',
                                amount: '$refundAmount'
                            }
                        }
                    }
                }
            ];

            const result = await Refund.aggregate(pipeline);
            const data = result[0];

            if (!data) {
                return {
                    totalRefunds: 0,
                    refundCount: 0,
                    avgRefundAmount: 0,
                    byReason: {},
                    byStatus: {}
                };
            }

            // Process refunds by reason
            const refundsByReason = data.byReason.reduce((acc: any, item: any) => {
                acc[item.reason] = (acc[item.reason] || 0) + item.amount;
                return acc;
            }, {});

            // Process refunds by status
            const refundsByStatus = data.byStatus.reduce((acc: any, item: any) => {
                acc[item.status] = (acc[item.status] || 0) + item.amount;
                return acc;
            }, {});

            return {
                totalRefunds: data.totalRefunds,
                refundCount: data.refundCount,
                avgRefundAmount: data.avgRefundAmount,
                byReason: refundsByReason,
                byStatus: refundsByStatus
            };
        } catch (error) {
            throw new Error(`Failed to get refund statistics: ${(error as Error).message}`);
        }
    }

    /**
     * Get payment trends over time
     */
    async getPaymentTrends(dateRange: DateRange, groupBy: 'day' | 'week' | 'month' = 'day'): Promise<PaymentTrend[]> {
        try {
            const { startDate, endDate } = dateRange;
            
            let dateFormat: string;
            switch (groupBy) {
                case 'week':
                    dateFormat = '%Y-%U'; // Year-Week
                    break;
                case 'month':
                    dateFormat = '%Y-%m'; // Year-Month
                    break;
                default:
                    dateFormat = '%Y-%m-%d'; // Year-Month-Day
            }

            const pipeline = [
                {
                    $match: {
                        date: { $gte: startDate, $lte: endDate },
                        status: 'completed'
                    }
                },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: dateFormat, date: '$date' } },
                            module: '$type'
                        },
                        amount: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { '_id.date': 1 as const, '_id.module': 1 as const }
                }
            ];

            const results = await Payment.aggregate(pipeline);
            
            return results.map(item => ({
                date: item._id.date,
                module: item._id.module,
                amount: item.amount,
                count: item.count
            }));
        } catch (error) {
            throw new Error(`Failed to get payment trends: ${(error as Error).message}`);
        }
    }

    /**
     * Get revenue breakdown by module
     */
    async getRevenueByModule(dateRange: DateRange) {
        try {
            const { startDate, endDate } = dateRange;
            
            const pipeline = [
                {
                    $match: {
                        date: { $gte: startDate, $lte: endDate },
                        status: 'completed'
                    }
                },
                {
                    $group: {
                        _id: '$type',
                        totalRevenue: { $sum: '$amount' },
                        transactionCount: { $sum: 1 },
                        avgTransactionValue: { $avg: '$amount' }
                    }
                },
                {
                    $sort: { totalRevenue: -1 as const }
                }
            ];

            const results = await Payment.aggregate(pipeline);
            
            const total = results.reduce((sum, item) => sum + item.totalRevenue, 0);
            
            return results.map(item => ({
                module: item._id,
                revenue: item.totalRevenue,
                transactionCount: item.transactionCount,
                avgTransactionValue: item.avgTransactionValue,
                percentage: total > 0 ? ((item.totalRevenue / total) * 100).toFixed(2) : 0
            }));
        } catch (error) {
            throw new Error(`Failed to get revenue by module: ${(error as Error).message}`);
        }
    }

    /**
     * Get daily revenue summary
     */
    async getDailyRevenueSummary(date: Date) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const pipeline = [
                {
                    $match: {
                        date: { $gte: startOfDay, $lte: endOfDay }
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        totalAmount: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ];

            const results = await Payment.aggregate(pipeline);
            
            const summary = {
                date: date.toISOString().split('T')[0],
                completed: { amount: 0, count: 0 },
                pending: { amount: 0, count: 0 },
                failed: { amount: 0, count: 0 },
                refunded: { amount: 0, count: 0 },
                total: { amount: 0, count: 0 }
            };

            results.forEach(item => {
                if (item._id in summary) {
                    (summary as any)[item._id] = {
                        amount: item.totalAmount,
                        count: item.count
                    };
                }
                summary.total.amount += item.totalAmount;
                summary.total.count += item.count;
            });

            return summary;
        } catch (error) {
            throw new Error(`Failed to get daily revenue summary: ${(error as Error).message}`);
        }
    }
}