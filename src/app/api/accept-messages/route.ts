import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: 'Not Authenticated'
        }, { status: 401 });
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { isAcceptingMessages: acceptMessages },
            { new: true });

        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: 'failed to update user status of accepting messages'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'User status of accepting messages updated successfully'
        }, { status: 200 });

    } catch (error) {
        console.log('Failed to update user status of accepting messages', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update user status of accepting messages'
        }, { status: 500 });
    }

}

// write get method here to fetch user status of accepting messages
export async function GET(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: 'Not Authenticated'
        }, { status: 401 });
    }

    const userId = user._id;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            isAcceptingMessages: user.isAcceptingMessages
        }, { status: 200 });

    } catch (error) {
        console.log('Failed to fetch user status of accepting messages', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch user status of accepting messages'
        }, { status: 500 });
    }
}