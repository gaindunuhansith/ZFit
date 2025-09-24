import type { Request, Response } from 'express';
import BookingModel, { type BookingDocument } from '../models/booking.model.js';
import AppError from '../util/AppError.js';
import { NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/http.js';
import mongoose from 'mongoose';

export class BookingService {
    /**
     * Create a new booking
     */
    static async createBooking(bookingData: Partial<BookingDocument>) {
        try {
            // Validate required fields
            if (!bookingData.member) {
                throw new AppError(BAD_REQUEST, 'Member is required');
            }
            if (!bookingData.bookingType || !bookingData.resource) {
                throw new AppError(BAD_REQUEST, 'Booking type and resource are required');
            }

            // Validate member exists
            const memberExists = await mongoose.model('User').findById(bookingData.member);
            if (!memberExists) {
                throw new AppError(NOT_FOUND, 'Member not found');
            }

            // Validate resource exists
            await BookingService.validateResource(
                bookingData.bookingType,
                bookingData.resource!
            );

            // Create booking
            const booking = new BookingModel(bookingData);
            await booking.save();

            // Populate references
            await booking.populate([
                { path: 'member', select: 'name email' },
                { path: 'resource' }
            ]);

            return booking;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(BAD_REQUEST, error.message);
        }
    }

    /**
     * Get member's bookings
     */
    static async getMemberBookings(memberId: string) {
        try {
            const bookings = await BookingModel.find({ member: memberId, status: 'active' })
                .populate('member', 'name email')
                .populate('resource')
                .sort({ date: 1, startTime: 1 });

            return bookings;
        } catch (error: any) {
            throw new AppError(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    /**
     * Get booking by ID
     */
    static async getBookingById(id: string) {
        try {
            const booking = await BookingModel.findById(id)
                .populate('member', 'name email')
                .populate('resource');

            if (!booking) {
                throw new AppError(NOT_FOUND, 'Booking not found');
            }

            return booking;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(BAD_REQUEST, 'Invalid booking ID');
        }
    }

    /**
     * Update booking (reschedule)
     */
    static async updateBooking(id: string, updateData: Partial<BookingDocument>) {
        try {
            const booking = await BookingModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate('member', 'name email')
             .populate('resource');

            if (!booking) {
                throw new AppError(NOT_FOUND, 'Booking not found');
            }

            return booking;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(BAD_REQUEST, error.message);
        }
    }

    /**
     * Cancel booking
     */
    static async cancelBooking(id: string) {
        try {
            const booking = await BookingModel.findByIdAndUpdate(
                id,
                { status: 'cancelled' },
                { new: true, runValidators: true }
            ).populate('member', 'name email')
             .populate('resource');

            if (!booking) {
                throw new AppError(NOT_FOUND, 'Booking not found');
            }

            return booking;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(BAD_REQUEST, error.message);
        }
    }

    /**
     * Validate resource exists for given booking type
     */
    public static async validateResource(bookingType: string, resourceId: string) {
        let modelName = '';

        switch (bookingType) {
            case 'trainer':
                modelName = 'User';
                break;
            case 'class':
                modelName = 'Class';
                break;
            case 'equipment':
            case 'gym_session':
                modelName = 'Facility';
                break;
            default:
                throw new AppError(BAD_REQUEST, 'Invalid booking type');
        }

        const resource = await mongoose.model(modelName).findById(resourceId);
        if (!resource) {
            throw new AppError(NOT_FOUND, `${bookingType} resource not found`);
        }

        return resource;
    }
}
