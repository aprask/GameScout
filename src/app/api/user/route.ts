'use server';
import * as userService from '@/app/api/core/services/user';

export async function GET() {
    try {
        const users = await userService.getAllUsers();
        return Response.json({
        status: "ok",
        users: users,
        }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {email, google_id} = body;
        const user = await userService.createUser(google_id, email);
        return Response.json({
            status: "created",
            user: user,
        }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}