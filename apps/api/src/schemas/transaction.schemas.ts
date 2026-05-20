import { z } from "zod";

export const createTransactionSchema = z.object({
    description: z.string().trim().min(1).max(120),
    amountMinor: z.number().int().positive(),
    type: z.enum(['INCOME', 'EXPENSE']),
    date: z.coerce.date(),
    categoryId: z.string().optional(),
});

export const transactionQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    categoryId: z.string().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    sortBy: z.enum(["date", "amountMinor", "createdAt"]).default("date"),
    sortOrder: z.enum(["asc","desc"]).default("desc"),

});