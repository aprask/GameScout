"use server";
import * as reviewService from "@/app/api/core/services/reviews";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pathVars = url.pathname.split("/");
    const reviewId = pathVars[pathVars.length - 1];
    if (!reviewId) {
      throw new Error("Review ID is required");
    }
    const review = await reviewService.getReviewsByUserId(reviewId);
    return Response.json(
      {
        status: "ok",
        review: review,
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
