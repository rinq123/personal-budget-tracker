import { z } from "zod";


export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});