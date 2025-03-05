'use server';
import * as userService from '@/app/api/core/services/user';

export async function GET() {
    const users = await userService.getAllUsers();
    return Response.json({
      status: "ok",
      users: users,
    }, { status: 200 });
}

export async function POST(req: Request) {
    const body = await req.json()
    const {email, google_id} = body;
    const user = await userService.createUser(email, google_id);
    return Response.json({
        status: "created",
        user: user,
    }, { status: 201 });
}