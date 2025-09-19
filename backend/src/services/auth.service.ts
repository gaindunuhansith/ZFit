import UserModel from "../models/user.model.js";

type CreateAccountParams = {
    name: string;
    email: string;
    password: string;
    contactNo: string;
    dob?: Date;
    profile: {
        address?: string;
        emergencyContact?: string;
    },
    consent: {
        gdpr: boolean;
        marketing: boolean;
    },
    role: string;
}

export const createAccount = async (data: CreateAccountParams) => {
    //check if the user already exists
    const existingUser = await UserModel.exists({
        email: data.email,
    });

    
}