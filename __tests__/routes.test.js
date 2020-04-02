"use strict";

const request = require("supertest");
const server = require("../index");

beforeAll(async () => {
    console.log("Jest starting");
});

afterAll(() => {
    server.close();
    console.log("App closed");
});

describe("basic routes test", () => {
  test("get home route GET /ping", async () => {
    const response = await request(server).get("/ping");
    expect(response.status).toEqual(200);
    expect(response.text).toContain("Hello");
  });
  test("get home route GET /secreto", async () => {
    const response = await request(server).get("/secreto");
    expect(response.status).toEqual(401);
  });
});