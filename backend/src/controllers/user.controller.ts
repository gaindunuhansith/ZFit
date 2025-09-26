import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { 
    getAllUsers, 
    getAllMembers, 
    getActiveMembers, 
    getInactiveMembers,
    getAllStaff, 
    getAllManagers, 
    getUserById, 
    getUserByEmail, 
    createUser, 
    updateUser, 
    deleteUser, 
    updateUserStatus 
} from "../services/user.service.js";
import { CREATED, OK } from "../constants/http.js";

// Validation schemas
const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    contactNo: z.string()
        .min(1, "Phone number is required")
        .regex(/^(?:\+94|0)[1-9]\d{8}$/, "Enter a valid Sri Lankan Phone number"),
    dob: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), "Invalid date"),
    profile: z.object({
        address: z.string().optional(),
        emergencyContact: z.string().optional()
    }).optional(),
    consent: z.object({
        gdpr: z.boolean(),
        marketing: z.boolean(),
    }),
    role: z.enum(['member', 'staff', 'manager']),
    status: z.enum(['active', 'inactive', 'expired']).default('active'),
});

const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string()
        .min(8)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[0-9]/)
        .regex(/[^A-Za-z0-9]/)
        .optional(),
    contactNo: z.string()
        .regex(/^(?:\+94|0)[1-9]\d{8}$/)
        .optional(),
    dob: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), "Invalid date"),
    profile: z.object({
        address: z.string().optional(),
        emergencyContact: z.string().optional()
    }).optional(),
    role: z.enum(['member', 'staff', 'manager']).optional(),
    status: z.enum(['active', 'inactive', 'expired']).optional(),
});

const userIdSchema = z.string().min(1, "User ID is required");
const emailSchema = z.string().email("Invalid email format");
const statusSchema = z.object({
    status: z.enum(['active', 'inactive', 'expired'])
});

/**
 * Get all users
 */
export const getAllUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllUsers();
        
        return res.status(OK).json({
            success: true,
            data: users,
            message: "Users retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all members
 */
export const getAllMembersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const members = await getAllMembers();
        
        return res.status(OK).json({
            success: true,
            data: members,
            message: "Members retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get active members
 */
export const getActiveMembersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const members = await getActiveMembers();
        
        return res.status(OK).json({
            success: true,
            data: members,
            message: "Active members retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get inactive members
 */
export const getInactiveMembersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const members = await getInactiveMembers();
        
        return res.status(OK).json({
            success: true,
            data: members,
            message: "Inactive members retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all staff
 */
export const getAllStaffHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staff = await getAllStaff();
        
        return res.status(OK).json({
            success: true,
            data: staff,
            message: "Staff retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all managers
 */
export const getAllManagersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const managers = await getAllManagers();
        
        return res.status(OK).json({
            success: true,
            data: managers,
            message: "Managers retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user by ID
 */
export const getUserByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = userIdSchema.parse(req.params.id);
        const user = await getUserById(userId);
        
        return res.status(OK).json({
            success: true,
            data: user,
            message: "User retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user by email
 */
export const getUserByEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = emailSchema.parse(req.params.email);
        const user = await getUserByEmail(email);
        
        return res.status(OK).json({
            success: true,
            data: user,
            message: "User retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new user
 */
export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = createUserSchema.parse(req.body);
        const user = await createUser(userData);
        
        return res.status(CREATED).json({
            success: true,
            data: user,
            message: "User created successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user
 */
export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = userIdSchema.parse(req.params.id);
        const updateData = updateUserSchema.parse(req.body);
        
        const user = await updateUser(userId, updateData);
        
        return res.status(OK).json({
            success: true,
            data: user,
            message: "User updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 */
export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = userIdSchema.parse(req.params.id);
        const result = await deleteUser(userId);
        
        return res.status(OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user status
 */
export const updateUserStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = userIdSchema.parse(req.params.id);
        const { status } = statusSchema.parse(req.body);
        
        const user = await updateUserStatus(userId, status);
        
        return res.status(OK).json({
            success: true,
            data: user,
            message: "User status updated successfully"
        });
    } catch (error) {
        next(error);
    }
};