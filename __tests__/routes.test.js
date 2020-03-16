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
    test("get home route GET /", async () => {
       const response = await request(server).get("/");
       expect(response.status).toEqual(200);
        expect(response.text).toContain("Hello");
    });
});