import { z } from "zod";

export const createFixedPaymentSchema = z.object({
    name: z.string().trim().min(1).max(120),
    amountMinor: z.number().int().positive(),
    type: z.enum(["INCOME", "EXPENSE"]),
    categoryId: z.string().optional(),
    dueDay: z.number().int().min(1).max(31).optional(),
});
