"use server";

const IGDB_AUTH_URL =
  "https://id.twitch.tv/oauth2/token?client_id=" +
  process.env.IGDBClientId +
  "&client_secret=" +
  process.env.IGDBSecretId +
  "&grant_type=client_credentials";

const IGDB_API_URL = "https://api.igdb.com/v4";
let bearer_token;

export async function authenticate() {
  const response = await fetch(IGDB_AUTH_URL, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to obtain access token");
  }

  const data = await response.json();
  bearer_token = `Bearer ${data.access_token}`;
}
