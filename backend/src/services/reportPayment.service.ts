import Payment from "../models/payment.model.js";
import RecurringPayment from "../models/recurringPayment.model.js";
import Refund from "../models/refund.model.js";
import Invoice from "../models/invoice.model.js";

export class ReportPaymentService {

    // Get revenue by module (membership, booking, inventory, other)
    async getRevenueByModule(startDate: Date, endDate: Date, module?: string) {
        try {
            const matchConditions: any = {
                status: 'completed',
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            };

            if (module) {
                matchConditions.type = module;
            }

            const revenueData = await Payment.aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: '$type',
                        totalAmount: { $sum: '$amount' },
                        transactionCount: { $sum: 1 },
                        averageAmount: { $avg: '$amount' }
                    }
                },
                {
                    $project: {
                        module: '$_id',
                        totalAmount: 1,
                        transactionCount: 1,
                        averageAmount: { $round: ['$averageAmount', 2] },
                        _id: 0
                    }
                },
                { $sort: { totalAmount: -1 } }
            ]);

            return {
                period: { startDate, endDate },
                summary: revenueData,
                totalRevenue: revenueData.reduce((sum, item) => sum + item.totalAmount, 0),
                totalTransactions: revenueData.reduce((sum, item) => sum + item.transactionCount, 0)
            };
        } catch (error) {
            throw new Error(`Failed to generate revenue report: ${(error as Error).message}`);
        }
    }

    // Get payment trends (daily, monthly, yearly)
    async getPaymentTrends(period: 'daily' | 'monthly' | 'yearly', startDate: Date, endDate: Date) {
        try {
            let groupBy: any;

            switch (period) {
                case 'daily':
                    groupBy = {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        day: { $dayOfMonth: '$date' }
                    };
                    break;
                case 'monthly':
                    groupBy = {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    };
                    break;
                case 'yearly':
                    groupBy = {
                        year: { $year: '$date' }
                    };
                    break;
            }

            const trendData = await Payment.aggregate([
                {
                    $match: {
                        date: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: groupBy,
                        totalAmount: { $sum: '$amount' },
                        transactionCount: { $sum: 1 },
                        successfulPayments: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        },
                        failedPayments: {
                            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
                        }
                    }
                },
                {
                    $project: {
                        period: '$_id',
                        totalAmount: 1,
                        transactionCount: 1,
                        successfulPayments: 1,
                        failedPayments: 1,
                        successRate: {
                            $multiply: [
                                { $divide: ['$successfulPayments', '$transactionCount'] },
                                100
                            ]
                        },
                        _id: 0
                    }
                },
                { $sort: { 'period.year': 1, 'period.month': 1, 'period.day': 1 } }
            ]);

            return {
                period,
                dateRange: { startDate, endDate },
                trends: trendData
            };
        } catch (error) {
            throw new Error(`Failed to generate payment trends: ${(error as Error).message}`);
        }
    }

    // Get refund statistics
    async getRefundStatistics(startDate: Date, endDate: Date) {
        try {
            const refundData = await Refund.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        totalAmount: { $sum: '$amount' },
                        refundCount: { $sum: 1 },
                        averageAmount: { $avg: '$amount' }
                    }
                },
                {
                    $project: {
                        status: '$_id',
                        totalAmount: 1,
                        refundCount: 1,
                        averageAmount: { $round: ['$averageAmount', 2] },
                        _id: 0
                    }
                }
            ]);

            const totalRefunds = await Refund.countDocuments({
                createdAt: { $gte: startDate, $lte: endDate }
            });

            const totalRefundAmount = await Refund.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            return {
                period: { startDate, endDate },
                summary: refundData,
                totalRefunds,
                totalRefundAmount: totalRefundAmount[0]?.total || 0
            };
        } catch (error) {
            throw new Error(`Failed to generate refund statistics: ${(error as Error).message}`);
        }
    }

    // Get transaction summary with filters
    async getTransactionSummary(filters: {
        startDate?: Date;
        endDate?: Date;
        type?: string;
        status?: string;
        method?: string;
    }) {
        try {
            const matchConditions: any = {};

            if (filters.startDate && filters.endDate) {
                matchConditions.date = {
                    $gte: filters.startDate,
                    $lte: filters.endDate
                };
            }

            if (filters.type) matchConditions.type = filters.type;
            if (filters.status) matchConditions.status = filters.status;
            if (filters.method) matchConditions.method = filters.method;

            const summary = await Payment.aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                        totalTransactions: { $sum: 1 },
                        completedTransactions: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        },
                        pendingTransactions: {
                            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                        },
                        failedTransactions: {
                            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
                        },
                        refundedTransactions: {
                            $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] }
                        },
                        averageTransactionAmount: { $avg: '$amount' }
                    }
                },
                {
                    $project: {
                        totalAmount: 1,
                        totalTransactions: 1,
                        completedTransactions: 1,
                        pendingTransactions: 1,
                        failedTransactions: 1,
                        refundedTransactions: 1,
                        averageTransactionAmount: { $round: ['$averageTransactionAmount', 2] },
                        completionRate: {
                            $multiply: [
                                { $divide: ['$completedTransactions', '$totalTransactions'] },
                                100
                            ]
                        },
                        _id: 0
                    }
                }
            ]);

            // Get recurring payment statistics
            const recurringStats = await RecurringPayment.aggregate([
                {
                    $match: filters.startDate && filters.endDate ? {
                        createdAt: { $gte: filters.startDate, $lte: filters.endDate }
                    } : {}
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        status: '$_id',
                        count: 1,
                        _id: 0
                    }
                }
            ]);

            return {
                filters,
                paymentSummary: summary[0] || {
                    totalAmount: 0,
                    totalTransactions: 0,
                    completedTransactions: 0,
                    pendingTransactions: 0,
                    failedTransactions: 0,
                    refundedTransactions: 0,
                    averageTransactionAmount: 0,
                    completionRate: 0
                },
                recurringPayments: recurringStats
            };
        } catch (error) {
            throw new Error(`Failed to generate transaction summary: ${(error as Error).message}`);
        }
    }

    // Get top revenue sources
    async getTopRevenueSources(limit: number = 10, startDate: Date, endDate: Date) {
        try {
            const topSources = await Payment.aggregate([
                {
                    $match: {
                        status: 'completed',
                        date: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
                },
                {
                    $group: {
                        _id: '$userId',
                        customerName: { $first: '$user.name' },
                        totalAmount: { $sum: '$amount' },
                        transactionCount: { $sum: 1 },
                        lastPaymentDate: { $max: '$date' }
                    }
                },
                {
                    $project: {
                        customerId: '$_id',
                        customerName: 1,
                        totalAmount: 1,
                        transactionCount: 1,
                        lastPaymentDate: 1,
                        averageOrderValue: { $round: [{ $divide: ['$totalAmount', '$transactionCount'] }, 2] },
                        _id: 0
                    }
                },
                { $sort: { totalAmount: -1 } },
                { $limit: limit }
            ]);

            return {
                period: { startDate, endDate },
                topCustomers: topSources
            };
        } catch (error) {
            throw new Error(`Failed to get top revenue sources: ${(error as Error).message}`);
        }
    }
}

export default new ReportPaymentService();