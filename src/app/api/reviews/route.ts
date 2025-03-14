"use server";
import * as reviewService from "@/app/api/core/services/reviews";

export async function GET() {
  try {
    const reviews = await reviewService.getAllReviews();
    return Response.json(
      {
        status: "ok",
        reviews: reviews,
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, game_id, rating, review } = body;
    const newReview = await reviewService.createReview(
      user_id,
      game_id,
      rating,
      review
    );
    return Response.json(
      {
        status: "created",
        review: newReview,
      },
      { status: 201 }
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
