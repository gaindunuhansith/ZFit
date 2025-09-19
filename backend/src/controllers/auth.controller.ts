import { Request, Response, NextFunction } from "express";
import { z } from "zod"

import { CREATED, OK, UNAUTHORIZED } from "../constants/http.js";
import SessionModel from "../models/session.model.js";

export const emailSchema = z.email().min(1).max(255);

export const passwordSchema = z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });
 
export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
});

export const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: emailSchema,
    password: passwordSchema,
    confrimPassword: passwordSchema,
    contactNo: z.string()
        .min(1, { message: "Phone number is required" })
        .regex(/^(?:\+94|0)[1-9]\d{8}$/, { message: "Enter a valid Sri Lanan Phone number" }),
    dob: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date" }),
    profile: z.object({
        address: z.string().min(1).max(500).optional,
        emergencyContact: z.string().optional(),
    }),
    consent: z.object({
        gdpr: z.boolean(),
        marketing: z.boolean(),
    }),
    role: z.string(),
}).refine((data) => data.password === data.confrimPassword, { message: "Passwords do not match", path: ["confirmPassword"]});

export const verificationCodeSchema = z.string().min(1).max(24);

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    verificationCode: verificationCodeSchema,
});


export const loginHandler = async (req: Request , res: Response, next: NextFunction) => {
    try {
        const request = loginSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"],
        });

        const { accessToken, refreshToken } = await loginUser(request)
    } catch (error) {
        next(error);
    }
}



