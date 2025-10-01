import resend from "../config/resend.js";
import env from "../config/env.js";
import { getBankTransferApprovalTemplate, getBankTransferDeclineTemplate, type BankTransferApprovalData } from "./emailTemplates.js";

type Params = {
    to: string,
    subject: string,
    text: string,
    html: string,
};

const getFromEmail = () => 
    env.NODE_ENV === "development" ? "send@resend.dev" : env.EMAIL_SENDER;

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


