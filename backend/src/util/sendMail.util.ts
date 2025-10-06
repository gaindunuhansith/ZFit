import resend from "../config/resend.js";
import env from "../config/env.js";
import { getLowStockAlertTemplate, type LowStockAlertData } from "./lowStockTemplate.js";

type Params = {
    to: string,
    subject: string,
    text: string,
    html: string,
};

const getFromEmail = () => 
    env.EMAIL_MODE === "development" ? "onboarding@resend.dev" : env.EMAIL_SENDER;

const getToEmail = (to: string) => 
    env.EMAIL_MODE === "development" ? "delivered@resend.dev" : to;

export const sendMail = async ({ to, subject, text, html }: Params) => {

    return await resend.emails.send({
        from: getFromEmail(),
        to: getToEmail(to),
        subject,
        text,
        html,
    }); 
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




