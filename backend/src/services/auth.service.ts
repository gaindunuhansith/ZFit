import { CONFLICT } from "../constants/http.js";
import VerificationCodeType from "../constants/verificationCodeType.js";
import UserModel from "../models/user.model.js";
import VerificationCodeModel from "../models/verficationCode.model.js";
import AppAssert from "../util/AppAssert.js";
import { oneYearFromNow } from "../util/date.util.js";
import APP_ORIGIN from "../config/env.js";

type CreateAccountParams = {
    name: string;
    email: string;
    password: string;
    contactNo: string;
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

    AppAssert(!existingUser, CONFLICT, "Email already in use");

    const user = await UserModel.create({
        name: data.name,
        email: data.email,
        password: data.password,
        contactNo: data.contactNo,
        consent: {
            gdpr: data.consent.gdpr,
            marketing: data.consent.marketing
        },
        role: data.role
    });

    const userId = user._id;

    const verificationCode = await VerificationCodeModel.create({
        userId,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow(),
    });

    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

    //send verification email
    const 

    console.log(user);
    console.log(verificationCode);


}