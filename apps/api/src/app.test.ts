import { describe, it, expect } from "vitest"
import request from "supertest";
import app from "./app.js";

describe("API app", () => {
    it("returns health status", async()=>{
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({status : "ok"});
    });

    it("returns root status", async()=>{
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({status : "all good"});
    });

    it("rejects dashboard access without a token", async ()=>{
        const response = await request(app).get("/transactions");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Missing or invalid authorization header",
        });
    });

    it("rejects invalid register input", async() => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                email: "fake email . com",
                password: "123",
                firstName: "",
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("invalid register request");
        expect(response.body.errors).toBeDefined();
    });
});
