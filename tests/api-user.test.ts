import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { startTestServer, stopTestServer } from "./setup";

let serverUrl: string;

beforeAll(async () => {
  const port = await startTestServer();
  serverUrl = `http://localhost:${port}`;
});

afterAll(async () => {
  await stopTestServer();
});

describe("GET /api/users", () => {
  it("should return an empty array because no users have been created", async () => {
    const response = await request(serverUrl).get("/api/user");
    expect(response.body).toEqual({ status: "ok", users: [] });

    expect(response.status).toBe(200);
  });
});
