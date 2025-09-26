import UserModel from "../models/user.model.js";
import AppAssert from "../util/AppAssert.js";
import { NOT_FOUND, CONFLICT } from "../constants/http.js";
import { hashValue } from "../util/bcrypt.util.js";

// Types for user operations
type CreateUserParams = {
    name: string;
    email: string;
    password: string;
    contactNo: string;
    dob?: string | undefined;
    profile?: {
        address?: string | undefined;
        emergencyContact?: string | undefined;
    } | undefined;
    consent: {
        gdpr: boolean;
        marketing: boolean;
    };
    role: 'member' | 'staff' | 'manager';
    status?: 'active' | 'inactive' | 'expired' | undefined;
};

type UpdateUserParams = {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    contactNo?: string | undefined;
    dob?: string | undefined;
    profile?: {
        address?: string | undefined;
        emergencyContact?: string | undefined;
    } | undefined;
    role?: 'member' | 'staff' | 'manager' | undefined;
    status?: 'active' | 'inactive' | 'expired' | undefined;
};

/**
 * Get all users
 */
export const getAllUsers = async () => {
    return await UserModel.find({})
        .select('-password')
        .sort({ createdAt: -1 });
};

/**
 * Get all members (role = 'member')
 */
export const getAllMembers = async () => {
    return await UserModel.find({ role: 'member' })
        .select('-password')
        .sort({ createdAt: -1 });
};

/**
 * Get all active members
 */
export const getActiveMembers = async () => {
    return await UserModel.find({ 
        role: 'member',
        status: 'active'
    })
        .select('-password')
        .sort({ createdAt: -1 });
};

/**
 * Get all inactive members
 */
export const getInactiveMembers = async () => {
    return await UserModel.find({ 
        role: 'member',
        status: { $in: ['inactive', 'expired'] }
    })
        .select('-password')
        .sort({ createdAt: -1 });
};

/**
 * Get all staff (role = 'staff')
 */
export const getAllStaff = async () => {
    return await UserModel.find({ role: 'staff' })
        .select('-password')
        .sort({ createdAt: -1 });
};

/**
 * Get all managers (role = 'manager')
 */
export const getAllManagers = async () => {
    return await UserModel.find({ role: 'manager' })
        .select('-password')
        .sort({ createdAt: -1 });
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string) => {
    const user = await UserModel.findById(userId).select('-password');
    AppAssert(user, NOT_FOUND, "User not found");
    return user;
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string) => {
    const user = await UserModel.findOne({ email }).select('-password');
    AppAssert(user, NOT_FOUND, "User not found");
    return user;
};

/**
 * Create new user
 */
export const createUser = async (data: CreateUserParams) => {
    // Check if user already exists
    const existingUser = await UserModel.exists({ email: data.email });
    AppAssert(!existingUser, CONFLICT, "Email already in use");

    // Create user
    const user = await UserModel.create({
        name: data.name,
        email: data.email,
        password: data.password, // Will be hashed by pre-save middleware
        contactNo: data.contactNo,
        dob: data.dob ? new Date(data.dob) : undefined,
        profile: data.profile || {},
        consent: data.consent,
        role: data.role,
        status: data.status || 'active',
        verified: true, // Auto-verify for admin created users
    });

    return await UserModel.findById(user._id).select('-password');
};

/**
 * Update user
 */
export const updateUser = async (userId: string, data: UpdateUserParams) => {
    const user = await UserModel.findById(userId);
    AppAssert(user, NOT_FOUND, "User not found");

    // Check if email is being updated and if it's already in use
    if (data.email && data.email !== user.email) {
        const existingUser = await UserModel.exists({ 
            email: data.email, 
            _id: { $ne: userId } 
        });
        AppAssert(!existingUser, CONFLICT, "Email already in use");
    }

    // Hash password if being updated
    if (data.password) {
        data.password = await hashValue(data.password);
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
            ...data,
            dob: data.dob ? new Date(data.dob) : user.dob,
            profile: data.profile ? { ...user.profile, ...data.profile } : user.profile
        },
        { new: true, runValidators: true }
    ).select('-password');

    AppAssert(updatedUser, NOT_FOUND, "User not found");
    return updatedUser;
};

/**
 * Delete user
 */
export const deleteUser = async (userId: string) => {
    const user = await UserModel.findByIdAndDelete(userId);
    AppAssert(user, NOT_FOUND, "User not found");
    
    return { message: "User deleted successfully" };
};

/**
 * Update user status
 */
export const updateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'expired') => {
    const user = await UserModel.findByIdAndUpdate(
        userId,
        { status },
        { new: true, runValidators: true }
    ).select('-password');

    AppAssert(user, NOT_FOUND, "User not found");
    return user;
};