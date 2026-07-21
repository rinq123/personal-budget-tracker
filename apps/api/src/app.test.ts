import { randomUUID } from "node:crypto";
import { afterAll, beforeEach, describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const testEmailPrefix = "budget-api-test-";

async function cleanupBudgetTestUsers() {
    await prisma.user.deleteMany({
        where: {
            email: {
                startsWith: testEmailPrefix,
            },
        },
    });
}

async function createAuthenticatedUser() {
    const email = `${testEmailPrefix}${randomUUID()}@example.com`;
    const password = "password123";

    const registerResponse = await request(app)
        .post("/auth/register")
        .send({
            email,
            password,
            firstName: "Budget",
        });
    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email,
            password,
        });
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();

    return {
        token: loginResponse.body.token as string,
        userId: registerResponse.body.user.id as string,
    };
}

async function createExpenseCategory(userId: string, name = "Groceries") {
    return prisma.category.create({
        data: {
            name: `${name} ${randomUUID()}`,
            type: "EXPENSE",
            userId,
        },
    });
}

beforeEach(async () => {
    await cleanupBudgetTestUsers();
});

afterAll(async () => {
    await cleanupBudgetTestUsers();
    await prisma.$disconnect();
});

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

describe("Budget API", () => {
    it("rejects budget access without a token", async () => {
        const response = await request(app).get("/budgets");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Missing or invalid authorization header",
        });
    });

    it("creates and lists a budget for an expense category", async () => {
        const { token, userId } = await createAuthenticatedUser();
        const category = await createExpenseCategory(userId);

        const createResponse = await request(app)
            .post("/budgets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                categoryId: category.id,
                amountMinor: 30000,
            });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body.budget).toMatchObject({
            amountMinor: 30000,
            categoryId: category.id,
            userId,
        });

        const listResponse = await request(app)
            .get("/budgets")
            .set("Authorization", `Bearer ${token}`);

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.budgets).toHaveLength(1);
        expect(listResponse.body.budgets[0]).toMatchObject({
            id: createResponse.body.budget.id,
            amountMinor: 30000,
            categoryId: category.id,
            category: {
                id: category.id,
                name: category.name,
            },
        });
    });

    it("rejects duplicate budgets for the same category", async () => {
        const { token, userId } = await createAuthenticatedUser();
        const category = await createExpenseCategory(userId);

        await request(app)
            .post("/budgets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                categoryId: category.id,
                amountMinor: 30000,
            });

        const duplicateResponse = await request(app)
            .post("/budgets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                categoryId: category.id,
                amountMinor: 40000,
            });

        expect(duplicateResponse.status).toBe(409);
        expect(duplicateResponse.body).toEqual({
            message: "A budget for this category already exists",
        });
    });

    it("updates an existing budget", async () => {
        const { token, userId } = await createAuthenticatedUser();
        const originalCategory = await createExpenseCategory(userId, "Groceries");
        const newCategory = await createExpenseCategory(userId, "Transport");

        const createResponse = await request(app)
            .post("/budgets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                categoryId: originalCategory.id,
                amountMinor: 30000,
            });

        const updateResponse = await request(app)
            .put(`/budgets/${createResponse.body.budget.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                categoryId: newCategory.id,
                amountMinor: 45000,
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.updatedBudget).toMatchObject({
            id: createResponse.body.budget.id,
            categoryId: newCategory.id,
            amountMinor: 45000,
        });
    });

    it("deletes an existing budget", async () => {
        const { token, userId } = await createAuthenticatedUser();
        const category = await createExpenseCategory(userId);

        const createResponse = await request(app)
            .post("/budgets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                categoryId: category.id,
                amountMinor: 30000,
            });

        const deleteResponse = await request(app)
            .delete(`/budgets/${createResponse.body.budget.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteResponse.status).toBe(204);

        const listResponse = await request(app)
            .get("/budgets")
            .set("Authorization", `Bearer ${token}`);

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.budgets).toHaveLength(0);
    });
});
