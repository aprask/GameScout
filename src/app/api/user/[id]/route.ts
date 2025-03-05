'use server';
import * as userService from '@/app/api/core/services/user';

export async function GET(req: Request) {
    console.log(new Date());
    const url = new URL(req.url);
    const pathVars = url.pathname.split('/');
    const userId = pathVars[pathVars.length-1];
    if (!userId) {
        return Response.json({
            status: "error",
            message: "User ID is required"
        }, { status: 400 });
    }
    const user = await userService.getUserById(userId);
    return Response.json({
      status: "ok",
      user: user,
    }, { status: 200 });
}

export async function PUT(req: Request) {
    const url = new URL(req.url);
    const pathVars = url.pathname.split('/');
    const userId = pathVars[pathVars.length-1];
    if (!userId) {
        return Response.json({
            status: "error",
            message: "User ID is required"
        }, { status: 400 });
    }
    const body = await req.json()
    const {last_login, is_active} = body;
    const user = await userService.updateUser(last_login, is_active, userId);
    return Response.json({
      status: "ok",
      user: user,
    }, { status: 200 });
}

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const pathVars = url.pathname.split('/');
    const userId = pathVars[pathVars.length-1];
    if (!userId) {
        return Response.json({
            status: "error",
            message: "User ID is required"
        }, { status: 400 });
    }
    const user = await userService.deleteUser(userId);
    return Response.json({
      status: "ok",
      user: user,
    }, { status: 204 });
}