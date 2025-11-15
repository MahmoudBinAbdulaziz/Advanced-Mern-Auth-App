import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE } from './emailsTemplate.js';
import { mailtrapClient } from './mailtrap.config.js';
import { sender } from './mailtrap.config.js';
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Email Verification',
            html:VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category:"Email Verification"

    } )
    console.log('Verification email sent:', response);
}catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

export const sendVerificationSuccessEmail = async (email, name) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid:"bca78b9b-1e10-45ed-b0ee-bf10545cd840",
            template_variables:{
                company_info_name:"Auth App",
                name:name
            },
            
        } );
    } catch (error) {
        console.error('Error sending verification success email:', error);
        throw new Error('Failed to send verification success email');
    }
};
export const sendPasswordResetEmail = async (email, resetToken) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Password Reset',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetToken),
            category:"Password Reset"

        });
        console.log('Password reset email sent:', response);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};
export const sendResetSuccessEmail = async (email, name) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid:"7dc431d1-5121-4e36-860b-ff70dc3061e7",
            template_variables:{
                company_info_name:"Auth App",
                name:name
            },

        });
    } catch (error) {
        console.error('Error sending reset success email:', error);
        throw new Error('Failed to send reset success email');
    }
};