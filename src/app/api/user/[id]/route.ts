'use server';
import * as userService from '@/app/api/core/services/user';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const pathVars = url.pathname.split('/');
        const userId = pathVars[pathVars.length-1];
        if (!userId) {
            throw new Error("User ID is required");
        }
        const user = await userService.getUserById(userId);
        return Response.json({
            status: "ok",
            user: user,
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

export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);
        const pathVars = url.pathname.split('/');
        const userId = pathVars[pathVars.length-1];
        if (!userId) {
            throw new Error("User ID is required");
        }
        const body = await req.json();
        const { last_login, is_active } = body;
        const user = await userService.updateUser(last_login, is_active, userId);
        return Response.json({
            status: "ok",
            user: user,
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

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const pathVars = url.pathname.split('/');
        const userId = pathVars[pathVars.length-1];
        if (!userId) {
            throw new Error("User ID is required");
        }
        const user = await userService.deleteUser(userId);
        return Response.json({
            status: "ok",
            user: user,
        }, { status: 200 }); // for some reason using a 204 threw an error...
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