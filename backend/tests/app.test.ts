import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("API", () => {
  it("GET /", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Backend is working!");
  });
});