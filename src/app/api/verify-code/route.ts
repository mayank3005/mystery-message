import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = user.verifyCodeExpiry > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return NextResponse.json({
                success: true,
                message: 'Account Verified Successfully'
            }, { status: 200 });
        } else if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: 'Verification code expired . Please sign up again to get a new code'
            }, { status: 400 });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Incorrect verification code'
            }, { status: 400 });
        }

    } catch (error) {
        console.log('Error verifying user ', error);
        return NextResponse.json({
            success: false,
            message: 'Error verifying user'
        }, { status: 500 });
    }
}
