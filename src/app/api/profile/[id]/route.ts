'use server';
import * as profileService from '@/app/api/core/services/profile';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const pathVars = url.pathname.split('/');
        const profileId = pathVars[pathVars.length-1];
        if (!profileId) {
            throw new Error("Profile ID is required");
        }
        const profile = await profileService.getProfileById(profileId);
        return Response.json({
            status: "ok",
            profile: profile,
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
        const profileId = pathVars[pathVars.length-1];
        if (!profileId) {
            throw new Error("User ID is required");
        }
        const body = await req.json();
        const { profile_picture, profile_name } = body;
        const profile = await profileService.updateProfile(profileId, profile_picture, profile_name);
        return Response.json({
            status: "ok",
            user: profile,
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
        const profileId = pathVars[pathVars.length-1];
        if (!profileId) {
            throw new Error("Profile ID is required");
        }
        await profileService.deleteProfile(profileId);
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