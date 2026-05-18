import { Router } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.js";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
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

    if (!existingUser) {
      res.status(401).json({ message: " invalid email or password " });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      existingUser?.passwordHash,
    );

    if (!passwordMatches) {
      res.status(401).json({
        message: "invalid email or password",
      });
      return;
    }

    const jwtsecret = process.env.JWT_SECRET;

    if (!jwtsecret) {
      throw new Error("JWT_SECRET is required");
    }

    const payload = { userId: existingUser.id };
    const token = jwt.sign(payload, jwtsecret, { expiresIn: "1h" });

    const user = {
      id: existingUser.id,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
    };

    res.status(200).json({
      message: "successful login ",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "unexpected internal server error" });
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
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

    if (existingUser) {
      res.status(409).json({ message: "Email is already registered " });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: "unexpected internal server error" });
  }
});

export default authRouter;
