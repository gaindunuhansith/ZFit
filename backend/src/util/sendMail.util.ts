import resend from "../config/resend.js";
import env from "../config/env.js";
import { getBankTransferApprovalTemplate, getBankTransferDeclineTemplate, type BankTransferApprovalData, getMembershipPurchaseSuccessTemplate, getMembershipPurchaseFailureTemplate, type MembershipPurchaseSuccessData, type MembershipPurchaseFailureData, getCartPurchaseSuccessTemplate, getCartPurchaseFailureTemplate, type CartPurchaseSuccessData, type CartPurchaseFailureData } from "./emailTemplates.js";
import { getLowStockAlertTemplate, type LowStockAlertData } from "./lowStockTemplate.js";

type Params = {
    to: string,
    subject: string,
    text: string,
    html: string,
};

const getFromEmail = () => 
    env.NODE_ENV === "development" ? "onboarding@resend.dev" : env.EMAIL_SENDER;

const getToEmail = (to: string) => 
    env.NODE_ENV === "development" ? "delivered@resend.dev" : to;

export const sendMail = async ({ to, subject, text, html }: Params) => {

    return await resend.emails.send({
        from: getFromEmail(),
        to: getToEmail(to),
        subject,
        text,
        html,
    }); 
};

/**
 * Send bank transfer approval email notification
 */
export const sendBankTransferApprovalEmail = async (
    userEmail: string, 
    data: BankTransferApprovalData
) => {
    try {
        const template = getBankTransferApprovalTemplate(data);
        
        const result = await sendMail({
            to: userEmail,
            subject: template.subject,
            text: template.text,
            html: template.html
        });

        console.log('Bank transfer approval email sent successfully:', result.data?.id);
        return { success: true, messageId: result.data?.id };
    } catch (error) {
        console.error('Failed to send bank transfer approval email:', error);
        throw new Error(`Failed to send approval email: ${(error as Error).message}`);
    }
};

/**
 * Send bank transfer decline email notification
 */
export const sendBankTransferDeclineEmail = async (
    userEmail: string, 
    data: BankTransferApprovalData
) => {
    try {
        const template = getBankTransferDeclineTemplate(data);
        
        const result = await sendMail({
            to: userEmail,
            subject: template.subject,
            text: template.text,
            html: template.html
        });

        console.log('Bank transfer decline email sent successfully:', result.data?.id);
        return { success: true, messageId: result.data?.id };
    } catch (error) {
        console.error('Failed to send bank transfer decline email:', error);
        throw new Error(`Failed to send decline email: ${(error as Error).message}`);
    }
};

export const sendLowStockAlert = async (to: string, data: LowStockAlertData) => {
    try {
        const emailTemplate = getLowStockAlertTemplate(data);
        
        const result = await sendMail({
            to,
            subject: emailTemplate.subject,
            text: emailTemplate.text,
            html: emailTemplate.html
        });

        console.log('Low stock alert email sent successfully:', result.data?.id);
        return { success: true, messageId: result.data?.id };
    } catch (error) {
        console.error('Failed to send low stock alert email:', error);
        throw new Error(`Failed to send low stock alert: ${(error as Error).message}`);
    }
};

/**
 * Send membership purchase success email notification
 */
export const sendMembershipPurchaseSuccessEmail = async (
    userEmail: string, 
    data: MembershipPurchaseSuccessData
) => {
    try {
        const template = getMembershipPurchaseSuccessTemplate(data);
        
        const result = await sendMail({
            to: userEmail,
            subject: template.subject,
            text: template.text,
            html: template.html
        });

        console.log('Membership purchase success email sent successfully:', result.data?.id);
        return { success: true, messageId: result.data?.id };
    } catch (error) {
        console.error('Failed to send membership purchase success email:', error);
        throw new Error(`Failed to send success email: ${(error as Error).message}`);
    }
};

/**
 * Send membership purchase failure email notification
 */
export const sendMembershipPurchaseFailureEmail = async (
    userEmail: string, 
    data: MembershipPurchaseFailureData
) => {
    try {
        const template = getMembershipPurchaseFailureTemplate(data);
        
        const result = await sendMail({
            to: userEmail,
            subject: template.subject,
            text: template.text,
            html: template.html
        });

        console.log('Membership purchase failure email sent successfully:', result.data?.id);
        return { success: true, messageId: result.data?.id };
    } catch (error) {
        console.error('Failed to send membership purchase failure email:', error);
        throw new Error(`Failed to send failure email: ${(error as Error).message}`);
    }
};

/**
 * Send cart purchase success email notification
 */
export const sendCartPurchaseSuccessEmail = async (
    userEmail: string, 
    data: CartPurchaseSuccessData
) => {
    try {
        const template = getCartPurchaseSuccessTemplate(data);
        
        const result = await sendMail({
            to: userEmail,
            subject: template.subject,
            text: template.text,
            html: template.html
        });

        console.log('Cart purchase success email sent successfully:', result.data?.id);
        return { success: true, messageId: result.data?.id };
    } catch (error) {
        console.error('Failed to send cart purchase success email:', error);
        throw new Error(`Failed to send cart success email: ${(error as Error).message}`);
    }
};

/**
 * Send cart purchase failure email notification
 */
export const sendCartPurchaseFailureEmail = async (
    userEmail: string, 
    data: CartPurchaseFailureData
) => {
    try {
        const template = getCartPurchaseFailureTemplate(data);
        
        const result = await sendMail({
            to: userEmail,
            subject: template.subject,
            text: template.text,
            html: template.html
        });

        console.log('Cart purchase failure email sent successfully:', result.data?.id);
        return { success: true, messageId: result.data?.id };
    } catch (error) {
        console.error('Failed to send cart purchase failure email:', error);
        throw new Error(`Failed to send cart failure email: ${(error as Error).message}`);
    }
};




