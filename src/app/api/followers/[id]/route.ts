'use server';
import * as followersService from '@/app/api/core/services/followers';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const pathVars = url.pathname.split('/');
        const userId = pathVars[pathVars.length-1];
        if (!userId) {
            throw new Error("User ID is required");
        }
        const followers = await followersService.getFollowers(userId);
        return Response.json({followers: followers}, { status: 200 });
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

export async function PATCH(req: Request) {
    try {
        const url = new URL(req.url);
        const pathVars = url.pathname.split('/');
        const userId = pathVars[pathVars.length-1];
        if (!userId) {
            throw new Error("User ID is required");
        }
        const body = await req.json();
        const { status } = body;
        const patchedFollowingStatus = await followersService.setFollowStatus(userId, status);
        return Response.json({ following_update: patchedFollowingStatus }, { status: 200 });
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
            throw new Error("Profile ID is required");
        }
        await followersService.deleteFollowingRelationship(userId);
        return Response.json({ status: 200 });
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