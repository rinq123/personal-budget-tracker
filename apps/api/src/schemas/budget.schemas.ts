import { z } from 'zod';

export const createBudgetsSchema = z.object({
    amountMinor: z.number().int().positive(),
    categoryId: z.string().min(1),
});

export const budgetQuerySchema = z.object({
  categoryId: z.string().optional(),
});

export const budgetSummaryQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});