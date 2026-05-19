import { z } from "zod";

export const createTransactionSchema = z.object({
    description: z.string().trim().min(1).max(120),
    amountMinor: z.number().int().positive(),
    type: z.enum(['INCOME', 'EXPENSE']),
    date: z.coerce.date(),
    categoryId: z.string().optional(),
});