import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../constants/http.js";
import VerificationCodeType from "../constants/verificationCodeType.js";
import UserModel from "../models/user.model.js";
import VerificationCodeModel from "../models/verficationCode.model.js";
import AppAssert from "../util/AppAssert.js";
import { oneYearFromNow } from "../util/date.util.js";
import env from "../config/env.js";
import { sendMail } from "../util/sendMail.util.js";
import { getVerifyEmailTemplate } from "../util/emailTemplates.js";
import SessionModel from "../models/session.model.js";
import { refreshTokenSignOptions, signToken, verifyToken, type RefreshTokenPayload} from "../util/jwt.js";

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
    userAgent?: string | undefined;
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

    const url = `${env.APP_ORIGIN}api/v1/auth/email/verify/${verificationCode._id}`;

    //send verification email
    const { error } = await sendMail({
        to: user.email,
        ...getVerifyEmailTemplate(url),
    });

    if (error) console.error(error);

    //create session
    const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent,
    });

    const refreshToken = signToken(
        {
        sessionId: session._id,
        },
        refreshTokenSignOptions
    );

    const accessToken = signToken({
        userId,
        sessionId: session._id,
        role: user.role,
    });

    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
}

type LoginParams = {
    email: string;
    password: string;
    userAgent?: string | undefined;
};

export const loginUser = async ({ email, password, userAgent }: LoginParams) => {

    const user = await UserModel.findOne({ email });
    AppAssert(user, UNAUTHORIZED , "Invalid email or password");

    const isValid = user.comparePassword(password);
    AppAssert(isValid, UNAUTHORIZED, "Invalid email or password");

    const userId = user._id;
    
    const session = await SessionModel.create({
        userId,
        userAgent,
    });

   
    const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions );
    const accessToken = signToken({
        userId,
        sessionId: session._id,
        role: user.role,
    });

    return { 
        user: user.omitPassword(),
        accessToken,
        refreshToken
    };

};

export const logoutUser = async (accessToken: string | undefined) => {
    const { payload } = verifyToken(accessToken || "" );

    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }
}

export const verifyEmail = async (code: string) => {
    
    const validCode = await VerificationCodeModel.findOne({
        _id: code,
        type: VerificationCodeType.EmailVerification,
        expiresAt: { $gt: new Date() },
    });

    AppAssert(validCode, NOT_FOUND, "Invalid or expired verificaiton code");

    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, { verified: true }, { new: true });

    AppAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

    await validCode.deleteOne();

    return {
        user: updatedUser.omitPassword()
    }
    
}