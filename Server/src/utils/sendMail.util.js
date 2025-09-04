import nodemailer from "nodemailer";

export const sendEmail = async (data) => {
    try {
        const transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: data.email,
            subject: data.subject,
            text: data.text
        }

        const result = await transport.sendMail(mailOption);
        return result;
    } catch (error) {
        console.log(error);
    }
};