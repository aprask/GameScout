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
  console
});

describe("GET /api/health", () => {
  it("should return server health status", async () => {
    const response = await request(serverUrl).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      message: "Server is up!",
    });
  });
});
