"use server";
import * as wishlistService from "@/app/api/core/services/wishlist";

export async function GET() {
  try {
    const wishlists = await wishlistService.getAllWishlist();
    return Response.json(
      {
        status: "ok",
        wishlists: wishlists,
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
    const { user_id, game_id } = body;
    const wishlist = await wishlistService.createWishlist(user_id, game_id);
    return Response.json(
      {
        status: "created",
        wishlist: wishlist,
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
