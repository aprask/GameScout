"use server";
import * as wishlistService from "@/app/api/core/services/wishlist";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pathVars = url.pathname.split("/");
    const wishlistId = pathVars[pathVars.length - 1];
    if (!wishlistId) {
      throw new Error("Wishlist ID is required");
    }
    const wishlist = await wishlistService.getWishlistById(wishlistId);
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

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const pathVars = url.pathname.split("/");
    const wishlistId = pathVars[pathVars.length - 1];
    if (!wishlistId) {
      throw new Error("Wishlist ID is required");
    }
    await wishlistService.deleteGameFromWishlist(wishlistId);
    return Response.json({ status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
