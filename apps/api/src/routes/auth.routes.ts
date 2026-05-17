import { Router } from "express";
import { registerSchema } from "../schemas/auth.schemas.js";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

const authRouter = Router();

authRouter.post('/login',(req, res) => {
    res.status(200).json({status: "login post route"});
});

authRouter.post('/register', async (req, res) => {
    const result = registerSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({
            message: "invalid register request",
            errors: result.error.flatten(),
        });
        return;
    }

    const { email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser){
        res.status(409).json({message : "Email is already registered "});
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
        },
        select: {
            id : true,
            email: true,
            createdAt : true,
        },
    });

    res.status(201).json({ user });
});

export default authRouter;