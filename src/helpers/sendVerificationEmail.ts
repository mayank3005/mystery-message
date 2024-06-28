import { resend } from '@/lib/resend'
import { ApiResponse } from '@/types/ApiResponse'
import VerificationEmail from '../../emails/VerificationEmail';

export async function sendVerificationEmail(
    email: string, username: string, verifyCode: string
): Promise<ApiResponse> {
    try {
        const res = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        console.log(email);
        console.log(res);
        return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { success: false, message: 'Failed to send verification email.' };
    }
}
