"use server";
import * as wishlistService from "@/app/api/core/services/wishlist";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pathVars = url.pathname.split("/");
    const game_id = +pathVars[pathVars.length - 1];
    if (game_id) {
      throw new Error("User ID is required");
    }
    const wishlist = await wishlistService.getWishlistByGameId(game_id);
    return Response.json(
      {
        status: "ok",
        wishlist: wishlist,
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
