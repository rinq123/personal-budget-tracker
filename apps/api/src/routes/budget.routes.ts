import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';
import { createBudgetsSchema } from '../schemas/budget.schemas.js';
import { budgetQuerySchema } from '../schemas/budget.schemas.js';


const budgetRouter = Router();

budgetRouter.get("/", requireAuth, async(req, res) => {
    if(!req.userId){
        return res.status(401).json({ message: "Unauthorised" });
    }

    const result = budgetQuerySchema.safeParse(req.query);
    if(!result.success){
        return res.status(400).json({
            message: "Invalid budgets query",
            errors: result.error.flatten(),
        });
    }


    const budgets = await prisma.budget.findMany({
        where: {
            userId: req.userId,
        },
        include:{
            category: true,
        },
        orderBy:[
            { category: { name: "asc"}},
        ],
    });

    return res.status(200).json({ budgets });
});


budgetRouter.post("/", requireAuth, async(req,res) =>{
    if(!req.userId){
        return res.status(401).json({ message: "Unauthorised "});
    }
    const result = createBudgetsSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({
            message: "Invalid budget request",
            errors: result.error.flatten(),
        });
        return;
    }

    const { categoryId, amountMinor } = result.data;

    const category = await prisma.category.findFirst({
        where:{
            id: categoryId,
            userId: req.userId,
            type: "EXPENSE",
        },
    });

    if(!category){
        return res.status(400).json({ message: "Category not found"});
    }

    //send prisma query
    const budget = await prisma.budget.create({
        data: {
            amountMinor,
            categoryId,
            userId: req.userId,
        },
    });
    return res.status(201).json({ budget });
});