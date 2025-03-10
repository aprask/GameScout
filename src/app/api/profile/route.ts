'use server';
import * as profileService from '@/app/api/core/services/profile';

export async function GET() {
    try {
        const profiles = await profileService.getAllProfiles();
        return Response.json({
        status: "ok",
        users: profiles,
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
