"use server";
import * as gameService from "../../core/services/games";

export async function POST() {
  try {
    const response = await gameService.authenticate();
    return Response.json({
      status: "ok",
      message: response,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
