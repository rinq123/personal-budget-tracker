import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";
import { createFixedPaymentSchema } from "../schemas/fixed-payment.schemas.js";

const fixedPaymentRouter = Router();

fixedPaymentRouter.get("/", requireAuth, async(req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorised" });
    }

    const fixedPayments = await prisma.fixedPayment.findMany({
        where: {
            userId: req.userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return res.status(200).json({ fixedPayments });
});

fixedPaymentRouter.post("/", requireAuth, async(req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorised" });
    }

    const result = createFixedPaymentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid fixed payment input",
            errors: result.error.flatten(),
        });
    }

    const { name, amountMinor, type, categoryId, dueDay } = result.data;

    if (categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId: req.userId,
                type,
            },
        });

        if (!category) {
            return res.status(400).json({ message: "Category not found" });
        }
    }

    const fixedPayment = await prisma.fixedPayment.create({
        data: {
            name,
            amountMinor,
            type,
            dueDay: dueDay ?? null,
            categoryId: categoryId ?? null,
            userId: req.userId,
        },
    });

    return res.status(201).json({ fixedPayment });
});

fixedPaymentRouter.put<{ id: string }>("/:id", requireAuth, async(req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorised" });
    }

    const result = createFixedPaymentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid fixed payment input",
            errors: result.error.flatten(),
        });
    }

    const { id } = req.params;
    const { name, amountMinor, type, categoryId, dueDay } = result.data;

    const existingFixedPayment = await prisma.fixedPayment.findFirst({
        where: {
            id,
            userId: req.userId,
        },
    });

    if (!existingFixedPayment) {
        return res.status(404).json({ message: "Fixed payment not found" });
    }

    if (categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId: req.userId,
                type,
            },
        });

        if (!category) {
            return res.status(400).json({ message: "Category not found" });
        }
    }

    const fixedPayment = await prisma.fixedPayment.update({
        where: {
            id: existingFixedPayment.id,
        },
        data: {
            name,
            amountMinor,
            type,
            dueDay: dueDay ?? null,
            categoryId: categoryId ?? null,
        },
    });

    return res.status(200).json({ fixedPayment });
});

fixedPaymentRouter.delete<{ id: string }>("/:id", requireAuth, async(req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorised" });
    }

    const { id } = req.params;

    const result = await prisma.fixedPayment.deleteMany({
        where: {
            id,
            userId: req.userId,
        },
    });

    if (result.count === 0) {
        return res.status(404).json({ message: "Fixed payment not found" });
    }

    return res.status(204).send();
});

export default fixedPaymentRouter;
