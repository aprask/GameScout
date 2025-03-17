"use server";
import * as reviewService from "@/app/api/core/services/reviews";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pathVars = url.pathname.split("/");
    const gameId = +pathVars[pathVars.length - 1];
    if (!gameId) {
      throw new Error("Game ID is required");
    }
    const reviews = await reviewService.getReviewsByGameId(gameId);
    return Response.json(
      {
        status: "ok",
        review: reviews,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
