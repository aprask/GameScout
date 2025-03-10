'use server';
import * as followersService from '@/app/api/core/services/followers';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const pathVars = url.pathname.split('/');
        const followingId = pathVars[pathVars.length-1];
        if (!followingId) {
            throw new Error("Following ID is required");
        }
        const followingDetails = await followersService.getFollowingDetails(followingId);
        return Response.json({follower_details: followingDetails}, { status: 200 });
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
