'use server';
import * as followersService from '@/app/api/core/services/followers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { following, follower, status } = body;
        const followers = await followersService.createFollowingRelationship(following, follower, status);
        return Response.json({
            status: "created",
            followers: followers,
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